import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const AIMatchAssistant: React.FC = () => {
  const { turfs, setSelectedTurf, setBookingTurf } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    summary: string;
    turfIds: string[];
    parsedIntent?: any;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const samplePrompts = [
    '7-a-side football in Dhanmondi under BDT 2,500',
    'Box cricket arena in Uttara with floodlights',
    'Best football turf in Bashundhara tonight',
  ];

  const handleSearch = async (textToSearch?: string) => {
    const query = textToSearch || prompt;
    if (!query.trim()) return;

    setIsLoading(true);
    setIsOpen(true);
    try {
      const data = await api.matchTurfsWithAI(query);
      const matchedIds = data.turfs.map((t) => t.id);
      setAiResult({
        summary: data.aiSummary,
        turfIds: matchedIds,
        parsedIntent: data.parsedIntent,
      });
    } catch (err: any) {
      setAiResult({
        summary: 'Could not reach AI assistant right now. Showing live arenas based on current filters.',
        turfIds: turfs.slice(0, 3).map((t) => t.id),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTurf = (turfId: string) => {
    const found = turfs.find((t) => t.id === turfId);
    if (found) {
      setSelectedTurf(found);
    }
  };

  const handleBookDirect = (turfId: string) => {
    const found = turfs.find((t) => t.id === turfId);
    if (found) {
      setBookingTurf(found);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>TurfBD AI Pitch Matchmaker</span>
              <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-1.5 py-0.2 rounded font-semibold uppercase">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Tell our AI your squad size, area, budget, or timing in plain language
            </p>
          </div>
        </div>

        {isOpen && (
          <button
            onClick={() => {
              setIsOpen(false);
              setAiResult(null);
            }}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title="Close results"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. 'Looking for 7-a-side in Dhanmondi under 2500 BDT tonight'..."
            className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
          />
          {prompt && (
            <button
              onClick={() => setPrompt('')}
              className="absolute right-3 top-2.5 text-neutral-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => handleSearch()}
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm flex-shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Matching...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Match Now</span>
            </>
          )}
        </button>
      </div>

      {/* Prompt pills */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
        <span className="text-[10px] text-neutral-400 font-medium mr-1">Quick Match:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(p);
              handleSearch(p);
            }}
            className="text-[10px] bg-neutral-800/80 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-500/40 text-neutral-300 border border-neutral-700/60 rounded-lg px-2.5 py-1 transition-all cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Result drawer */}
      {isOpen && aiResult && (
        <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-3">
          <div className="p-3 bg-neutral-950/90 border border-neutral-800 rounded-xl">
            <div className="flex items-start gap-2">
              <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-200 leading-relaxed">
                {aiResult.summary}
              </div>
            </div>
          </div>

          {/* Matched Turfs preview */}
          {aiResult.turfIds.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-neutral-400">
                Recommended Live Arenas:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {aiResult.turfIds.map((id) => {
                  const t = turfs.find((item) => item.id === id);
                  if (!t) return null;
                  return (
                    <div
                      key={t.id}
                      className="bg-neutral-800/70 border border-neutral-700/70 hover:border-emerald-500/50 rounded-xl p-3 flex flex-col justify-between transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white truncate mr-2">
                          {t.name}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-emerald-400 flex-shrink-0">
                          BDT {t.hourlyRate.toLocaleString()}/hr
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate mb-3">
                        {t.area}, {t.city} • {t.sports.join(', ')}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSelectTurf(t.id)}
                          className="flex-1 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-[10px] font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleBookDirect(t.id)}
                          className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Book Slot</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
