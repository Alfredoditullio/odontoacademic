import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// Wrapper HTML del email. Envuelve el contenido del admin en un layout con branding.
function buildEmailHtml(opts: { subject: string; content: string; nombre: string; unsubscribeUrl: string }) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;color:#334155;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

<tr><td style="background:linear-gradient(135deg,#0284c7,#0891b2,#0d9488);padding:28px 40px;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="background:rgba(255,255,255,0.2);border-radius:10px;padding:8px 12px;vertical-align:middle;">
<span style="font-size:18px;">🦷</span></td>
<td style="padding-left:10px;vertical-align:middle;">
<span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:-0.4px;">OdontoLatam</span></td>
</tr></table>
</td></tr>

<tr><td style="padding:36px 40px;font-size:15px;line-height:1.7;color:#334155;">
${opts.content.replace(/{{nombre}}/g, opts.nombre)}
</td></tr>

<tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;font-size:11px;color:#94a3b8;">
<p style="margin:0 0 6px;">© ${new Date().getFullYear()} OdontoLatam — La comunidad dental de LATAM</p>
<p style="margin:0;">
<a href="https://odontolatam.com" style="color:#94a3b8;text-decoration:none;">odontolatam.com</a>
&nbsp;·&nbsp;
<a href="${opts.unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline;">Darme de baja</a>
</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  // Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY no configurada' }, { status: 500 });

  const { campaignId } = await request.json();
  if (!campaignId) return NextResponse.json({ error: 'campaignId requerido' }, { status: 400 });

  // Traer campaña
  const { data: campaign, error: cErr } = await supabase
    .from('newsletter_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();
  if (cErr || !campaign) return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });

  // Traer suscriptores
  const { data: subscribers, error: sErr } = await supabase
    .from('profiles')
    .select('id, email, display_name, unsubscribe_token')
    .eq('newsletter_subscribed', true);
  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 });

  const validSubs = (subscribers ?? []).filter((s) => s.email);
  if (validSubs.length === 0) return NextResponse.json({ error: 'No hay suscriptores activos' }, { status: 400 });

  // Marcar como enviando
  await supabase.from('newsletter_campaigns').update({ status: 'sending' }).eq('id', campaignId);

  const resend = new Resend(apiKey);
  const origin = request.headers.get('origin') || 'https://odontolatam.com';
  let sentCount = 0;
  let failCount = 0;

  // Enviar en batches de 10 para no saturar
  for (let i = 0; i < validSubs.length; i += 10) {
    const batch = validSubs.slice(i, i + 10);
    await Promise.all(batch.map(async (sub) => {
      const nombre = sub.display_name?.split(' ')[0] ?? 'colega';
      const unsubscribeUrl = `${origin}/unsubscribe?token=${sub.unsubscribe_token}`;
      const html = buildEmailHtml({
        subject: campaign.subject,
        content: campaign.content_html,
        nombre,
        unsubscribeUrl,
      });

      try {
        await resend.emails.send({
          from: `${campaign.from_name} <${campaign.from_email}>`,
          to: sub.email!,
          subject: campaign.subject,
          html,
        });

        await supabase.from('newsletter_sends').insert({
          campaign_id: campaignId,
          user_id: sub.id,
          email: sub.email,
          status: 'sent',
          sent_at: new Date().toISOString(),
        });
        sentCount++;
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : String(err);
        await supabase.from('newsletter_sends').insert({
          campaign_id: campaignId,
          user_id: sub.id,
          email: sub.email,
          status: 'failed',
          error,
        });
        failCount++;
      }
    }));
  }

  // Marcar como enviada
  await supabase.from('newsletter_campaigns').update({
    status: failCount === validSubs.length ? 'failed' : 'sent',
    sent_count: sentCount,
    sent_at: new Date().toISOString(),
  }).eq('id', campaignId);

  return NextResponse.json({ sent: sentCount, failed: failCount, total: validSubs.length });
}
