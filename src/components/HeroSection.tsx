import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, CheckCircle2, Zap, Trophy, Flame } from 'lucide-react';
import { TurfBDLogo } from './TurfBDLogo';
import { useApp } from '../context/AppContext';

export const HeroSection: React.FC = () => {
  const { setActiveTab } = useApp();

  const handleScrollToSearch = () => {
    const el = document.getElementById('search-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleListTurf = () => {
    setActiveTab('owner');
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-neutral-800/90 bg-neutral-950 shadow-2xl">
      {/* Background Hero Image with atmospheric gradients */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/images/turf_hero_banner.jpg" type="image/jpeg" />
          <img
            src="/images/turf_hero_banner.jpg"
            alt="Floodlit synthetic sports turf in Bangladesh at night"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 contrast-105"
            referrerPolicy="no-referrer"
          />
        </picture>
        {/* Deep cinematic overlays for contrast & legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color" />
      </div>

      {/* Main Hero Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        {/* Left Column: Brand, Headline, Value Props, CTAs */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          {/* Logo & Status Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <TurfBDLogo size="sm" variant="brand" showBadge badgeText="Live BD" />
            <div className="inline-flex items-center gap-1.5 bg-neutral-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
              <span>Real-Time Slot Engine</span>
            </div>
          </div>

          {/* Core Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Book Your Ground.{' '}
              <span className="block bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
                Kickoff Tonight.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl pt-1">
              Find verified football turfs and box cricket arenas near you. Reserve your slot instantly with instant bKash or Nagad advance tokens.
            </p>
          </div>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleScrollToSearch}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-neutral-950 font-extrabold rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Find Available Slots</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleListTurf}
              className="px-5 py-3.5 bg-neutral-900/80 hover:bg-neutral-800/90 text-white font-bold rounded-2xl text-sm border border-neutral-700/80 hover:border-emerald-500/50 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>List Your Turf</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                Partner
              </span>
            </button>
          </div>

          {/* Key Trust Signals */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80 max-w-lg">
            <div>
              <div className="flex items-center gap-1 text-white font-mono font-black text-base sm:text-lg">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>15+ Arenas</span>
              </div>
              <p className="text-[11px] text-neutral-400">Dhaka & Beyond</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-emerald-400 font-mono font-black text-base sm:text-lg">
                <Clock className="w-4 h-4" />
                <span>Till 02:00 AM</span>
              </div>
              <p className="text-[11px] text-neutral-400">Floodlit Night Slots</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-white font-mono font-black text-base sm:text-lg">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>৳1,000 Token</span>
              </div>
              <p className="text-[11px] text-neutral-400">Lock Instant Slot</p>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Futuristic UI Booking Cards */}
        <div className="lg:col-span-5 relative w-full flex flex-col items-center justify-center space-y-3 lg:space-y-4">
          {/* Ambient lighting glow */}
          <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Floating UI Card 1: Available Tonight */}
          <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 shadow-xl backdrop-blur-md transform transition-all hover:scale-[1.02] border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                  ⚽
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Dhanmondi Arena 7-a-side</div>
                  <div className="text-[10px] text-neutral-400">Road 9/A, Dhanmondi, Dhaka</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Available Tonight
              </span>
            </div>
          </div>

          {/* Floating UI Card 2: 20:00 - 21:00 Slot with Lock */}
          <div className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 shadow-xl backdrop-blur-md transform lg:translate-x-3 transition-all hover:scale-[1.02] border-l-4 border-l-cyan-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono">20:00 - 21:00 (Floodlit)</div>
                  <div className="text-[10px] text-neutral-400">Prime Match Slot</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-mono text-emerald-400">BDT 1,800/hr</span>
                <div className="text-[9px] text-neutral-400">FIFA Synthetic Turf</div>
              </div>
            </div>
          </div>

          {/* Floating UI Card 3: Verified Turf + ৳1000 Token Paid */}
          <div className="w-full max-w-sm grid grid-cols-2 gap-3">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 shadow-lg backdrop-blur-md flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Verified Turf</div>
                <div className="text-[10px] text-neutral-400">100% Guaranteed</div>
              </div>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 shadow-lg backdrop-blur-md flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono">৳1,000 Token</div>
                <div className="text-[10px] text-neutral-400">bKash / Nagad</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
