# Migrations OdontoLatam

| # | Archivo | Aplica |
|---|---|---|
| 001 | `001_users.sql` | Profiles + auth trigger |
| 002 | `002_align_schema.sql` | Categories, posts, comments, likes, polls, notifications, realtime de notifications |
| 003 | `003_messaging.sql` | Conversations + messages, RPCs `get_or_create_conversation` y `mark_conversation_read`, realtime de messages |

Aplicar en orden. Cada una se puede pegar en el SQL Editor de Supabase Dashboard o ejecutar con `supabase db push` si usás CLI.

---

## Cómo aplicar `002_align_schema.sql`

Esta migration **es destructiva** sobre `posts`, `comments` y `likes`. Asume que **no hay datos de producción**. Si en algún momento hay datos reales, escribir una migration aditiva en lugar de re-aplicar esta.

### Opción A — Supabase Dashboard (más rápido)

1. Abrir [supabase.com/dashboard/project/prpobheczarhlfathiow/sql/new](https://supabase.com/dashboard/project/prpobheczarhlfathiow/sql/new)
2. Pegar el contenido de `002_align_schema.sql`
3. Click en **Run**
4. Verificar que en **Database → Tables** aparezcan: `categories`, `posts`, `comments`, `likes`, `polls`, `poll_votes`, `notifications`
5. Verificar que en **Database → Replication** aparezca `supabase_realtime` con `notifications` y `comments` chequeadas

### Opción B — Supabase CLI

```bash
supabase db push    # aplica todas las migrations pendientes
```

### Verificación post-migration

En el SQL Editor de Supabase ejecutar:

```sql
-- Categorías sembradas
select slug, name from public.categories order by sort_order;
-- Debe devolver 8 filas

-- Realtime publication
select tablename from pg_publication_tables where pubname = 'supabase_realtime';
-- Debe incluir: notifications, comments

-- Triggers activos
select trigger_name, event_object_table from information_schema.triggers
  where trigger_schema = 'public';
-- Debe incluir: on_like_change, on_comment_change, on_follow_change, on_auth_user_created
```

## Cómo probar end-to-end localmente

### 1. Crear 2 cuentas de prueba

Si todavía no tenés 2 usuarios registrados, usar `/login` y crear 2 emails distintos. Ej:

- `test-a@odontolatam.com` / `Test1234!`
- `test-b@odontolatam.com` / `Test1234!`

> Nota: Supabase manda email de confirmación. Si querés saltar eso para testing, en el dashboard → Authentication → Providers → Email → desactivar "Confirm email" temporalmente.

### 2. Probar el feed

Logueado como **A**, ir a `/comunidad`. Debería mostrar el banner + composer + "Todavía no hay posts" (correcto: la DB está vacía).

### 3. Crear un post

`/comunidad/new` → completar → publicar → debería redirigir al detail del post recién creado.

Verificar en `/comunidad` que el post aparece (puede tardar hasta 30s por el `revalidate = 30`; refresh duro con Cmd+Shift+R para evitar el cache).

### 4. Probar likes (optimistic UI + persistencia)

En el detail del post, click en el corazón → debería:
- ponerse rosa de inmediato (optimistic)
- el contador subir a 1
- en la DB: aparecer una fila en `public.likes`
- en la DB: `posts.like_count = 1` (mantenido por trigger)

Click de nuevo → like se quita, contador a 0, fila borrada.

### 5. Probar comentarios (polling cada 10s) + notificaciones REALTIME 🚀

**Setup**: abrir el detail del post en **dos navegadores distintos** (o uno normal + uno incógnito). Logueate como A en uno y como B en el otro.

- En el navegador de **B**, escribir un comentario y enviar.
  - B ve su comment **instantáneo** (optimistic update).
- En el navegador de **A**, el comentario aparece dentro de **~10 segundos**
  (intervalo de polling). Si la pestaña de A no está visible, el polling
  se pausa hasta que vuelvas a la pestaña — ahí refetchea inmediatamente.
- En el header de A, la campanita incrementa en +1 con badge rojo en ~1 segundo
  (esa parte SÍ es Realtime, notificación de "B comentó tu post").

### 6. Probar mensajería privada con REALTIME 🚀 (Fase 2)

Aplicar **`003_messaging.sql`** primero (mismo SQL Editor del dashboard).

**Setup**: 2 usuarios A y B logueados en navegadores separados. Cada uno necesita haber creado su `profile` con un `handle` válido (Configuración → Mi Perfil).

1. Como **A**, andá a `/comunidad/u/{handle-de-B}` o directamente `/comunidad/mensajes/{handle-de-B}`. La conversación se crea atómicamente vía RPC si no existía.
2. Mandá un mensaje. Aparece **instantáneo** en A (optimistic).
3. En el navegador de **B**, dentro del chat con A: el mensaje aparece en **<1 segundo** (Realtime).
4. En el header de B (TopNav), el badge del ícono de mail aparece con +1 dentro de los próximos **30 segundos** (polling).
5. Cuando B abre el chat, el contador se resetea (server action `markConversationRead` → trigger SQL → próxima query del badge devuelve 0).

### 7. Probar notificaciones REALTIME 🚀

Con A en el feed, B da like al post de A:
- A debería ver el badge de la campana subir a +1 en vivo
- Click en la campana → dropdown con "A B le gustó tu post"
- Al abrir el dropdown, el badge se va a 0 (las marca como leídas)

## Diagnóstico si algo falla

### "Realtime no me llega nada"

```sql
-- ¿Está habilitada la publication?
select * from pg_publication_tables where pubname = 'supabase_realtime';
```

Si falta una tabla:
```sql
alter publication supabase_realtime add table public.notifications;
alter table public.notifications replica identity full;
```

En el dashboard: **Database → Replication** → asegurar que el toggle esté ON para cada tabla.

### "Insert falla con RLS"

```sql
-- Ver políticas activas
select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies where schemaname = 'public';
```

Para crear posts el usuario tiene que estar autenticado y la categoría tiene que existir con `post_policy = 'open'` (o ser admin).

### "El trigger no actualiza like_count"

```sql
-- Forzar recálculo de un post
update public.posts p
set like_count = (select count(*) from public.likes l where l.post_id = p.id)
where p.id = '<post-id>';
```

## Arquitectura: qué usa Realtime y qué no (decisiones de costo)

Pensado para escalar a **miles de usuarios concurrentes** sin disparar la factura.
Plan Pro: **500 conexiones Realtime incluidas, $10/mes por cada 1k extras**.

### Realtime SÍ (WebSocket)
- **`notifications`** — 1 conn por user logueado, filtrada por `user_id=eq.${uid}`.
  Multiplexable con el chat (1 WebSocket por tab del browser).
- **`messages`** (Fase 2 ✅) — 1 conn por chat abierto, filtrada por
  `conversation_id=eq.${id}`. RLS asegura que solo participantes los ven.
  Cuando el user cierra el chat → unsubscribe → libera el slot.
- **Presence (Fase 3)** — "está escribiendo...", "X usuarios viendo este post".
  Usará `channel.broadcast()` en vez de `postgres_changes` → no toca la DB.

### Realtime NO (REST + polling + optimistic UI)
- **Feed** — SSR con `revalidate = 30`. El HTML se cachea entre usuarios.
- **Likes** — optimistic update en el cliente + REST insert. Counter agregado
  en `posts.like_count` mantenido por trigger SQL.
- **Comments** — polling incremental cada 10s (`fetchNewCommentsSince`),
  PAUSADO cuando la pestaña está en background. El usuario que comenta ve
  su comment instantáneo (optimistic); los demás a los ~10s.
  → Cero WebSocket por user viendo posts.
- **Mail badge global** (TopNav) — polling cada 30s a `conversations`
  sumando `unread_for_X`. La query es indexada y barata (~1ms).
  → Cero WebSocket por badge.

### Proyección de costos por escala (Fase 1 + Fase 2)

Asumiendo ratio realista del 8% concurrent peak / MAU para una red social,
y que ~10% de los usuarios concurrent tienen un chat abierto:

| MAU | Concurrent | Notif (1 c/u) | Chat abierto (10%) | Conexiones totales | **Costo/mes extra** |
|---|---|---|---|---|---|
| 5.000 | 400 | 400 | 40 | 440 (multiplex en 1 WS por tab) | **$0** (entra en Pro) |
| 20.000 | 1.600 | 1.600 | 160 | ~1.760 | **~$13** |
| 50.000 | 4.000 | 4.000 | 400 | ~4.400 | **~$40** |
| 100.000 | 8.000 | 8.000 | 800 | ~8.800 | **~$83** |

**Importante: el cliente JS de Supabase multiplexa todos los channels en
un solo WebSocket por pestaña.** Un user con notificaciones + 1 chat abierto
= **1 conn**, no 2. Esto baja el costo real bastante por debajo de la tabla.

### Carga DB del polling de comments

Polling de comments es una `SELECT` muy cheap con cursor `created_at > since`
y el índice `comments_post_idx`. Costo aproximado:

| Users viendo posts (concurrent) | Polls/seg | DB Load |
|---|---|---|
| 500 | 50 | despreciable |
| 5.000 | 500 | <5% CPU |
| 50.000 | 5.000 | OK con read replica (Pro la incluye) |

Cuando la mayoría de pestañas están en background (visibilidad oculta),
el polling no se ejecuta → ahorro real del 60-90% en horario pico vs. peor caso.

## Límites del plan Pro

| Recurso | Límite | Headroom |
|---|---|---|
| MAUs | 100k | sobra para arrancar |
| Realtime concurrent | 500 | escalable a $10 / +1k conn |
| Postgres CPU | 2 vCPU shared | sobra |
| DB storage | 8 GB | sobra |
| Bandwidth | 250 GB | sobra |
