'use client';

/**
 * Card de encuesta con votación. Optimistic update + RPC vote_poll.
 *  - single-choice: click reemplaza tu voto previo.
 *  - multiple-choice: click toggle la opción.
 *  - Mientras no votaste se muestran solo labels; al votar se revelan los %.
 */

import { useState, useTransition } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { PollData } from '@/lib/queries/community';
import { votePoll } from '@/lib/actions/polls';

interface Props {
  poll: PollData;
  postId: string;
}

export function PollCard({ poll: initialPoll, postId }: Props) {
  const { user } = useAuth();
  const [poll, setPoll] = useState<PollData>(initialPoll);
  const [pending, startTransition] = useTransition();

  const hasVoted = poll.myVoteIndices.length > 0;
  const showResults = hasVoted; // estilo Twitter: results solo después de votar

  function handleVote(idx: number) {
    if (pending || !user) return;

    // Optimistic update
    const prev = poll;
    const next: PollData = { ...poll, totals: [...poll.totals], myVoteIndices: [...poll.myVoteIndices] };

    if (poll.multiple_choice) {
      // toggle de la opción
      const wasVoted = next.myVoteIndices.includes(idx);
      if (wasVoted) {
        next.myVoteIndices = next.myVoteIndices.filter((i) => i !== idx);
        next.totals[idx]    = Math.max((next.totals[idx] ?? 0) - 1, 0);
        next.totalVotes    -= 1;
      } else {
        next.myVoteIndices.push(idx);
        next.totals[idx]    = (next.totals[idx] ?? 0) + 1;
        next.totalVotes    += 1;
      }
    } else {
      // reemplazar voto previo
      const previousIdx = next.myVoteIndices[0];
      if (previousIdx === idx) return; // no cambió, ignorar
      if (previousIdx !== undefined) {
        next.totals[previousIdx] = Math.max((next.totals[previousIdx] ?? 0) - 1, 0);
        next.totalVotes -= 1;
      }
      next.myVoteIndices = [idx];
      next.totals[idx]   = (next.totals[idx] ?? 0) + 1;
      next.totalVotes   += 1;
    }

    setPoll(next);

    startTransition(async () => {
      const res = await votePoll(poll.id, idx, postId);
      if (!res.ok) {
        setPoll(prev);
      }
    });
  }

  const closed = poll.closes_at ? new Date(poll.closes_at) < new Date() : false;
  const winningTotal = Math.max(...poll.totals, 1);

  return (
    <div className="mt-5 bg-violet-50/50 border border-violet-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-violet-600 text-[20px]">ballot</span>
        <h3 className="font-bold text-slate-900">{poll.question}</h3>
        {poll.multiple_choice && <span className="text-[10px] font-bold uppercase text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full ml-auto">Multi-opción</span>}
      </div>

      <div className="space-y-2">
        {poll.options.map((opt, idx) => {
          const count = poll.totals[idx] ?? 0;
          const pct = poll.totalVotes > 0 ? Math.round((count / poll.totalVotes) * 100) : 0;
          const isMyVote = poll.myVoteIndices.includes(idx);
          const isWinning = showResults && count === winningTotal && count > 0;

          return (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              disabled={pending || closed || !user}
              className={`relative w-full text-left rounded-xl border overflow-hidden transition ${
                isMyVote
                  ? 'border-violet-500 bg-white'
                  : 'border-slate-200 bg-white hover:border-violet-300'
              } ${pending || closed || !user ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {showResults && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all ${isWinning ? 'bg-violet-200/60' : 'bg-slate-100'}`}
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between px-4 py-2.5 text-sm">
                <span className={`font-semibold ${isMyVote ? 'text-violet-700' : 'text-slate-700'}`}>
                  {isMyVote && <span className="material-symbols-outlined text-[16px] align-middle mr-1">check_circle</span>}
                  {opt}
                </span>
                {showResults && (
                  <span className={`font-black tabular-nums ${isWinning ? 'text-violet-700' : 'text-slate-500'}`}>{pct}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
        <span>{poll.totalVotes} {poll.totalVotes === 1 ? 'voto' : 'votos'}</span>
        {!user && <span className="text-violet-600 font-semibold">Iniciá sesión para votar</span>}
        {closed && <span className="text-amber-600 font-semibold">Cerrada</span>}
      </div>
    </div>
  );
}
