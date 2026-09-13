import React, { useState } from 'react';
import {
  User as UserIcon,
  Phone,
  Mail,
  CheckCircle2,
  CalendarCheck2,
  Trophy,
  ShieldCheck,
  LogOut,
  Sparkles,
  Building2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const ProfileView: React.FC = () => {
  const { currentUser, bookings, logout, switchRole, setActiveTab, setIsAuthModalOpen } = useApp();
  const [roleChangeSuccess, setRoleChangeSuccess] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-emerald-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sign in to your TurfBD Account</h2>
        <p className="text-sm text-zinc-400 max-w-sm mb-6">
          Access your match history, manage upcoming turf bookings, and get real-time game confirmations.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Calculate customer stats
  const userBookings = bookings.filter((b) => b.userId === currentUser.id);
  const confirmedCount = userBookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = userBookings.filter((b) => b.status === 'pending_approval').length;
  const totalSpent = userBookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setRoleChangeSuccess(`Switched active view to ${newRole.toUpperCase()}`);
    setTimeout(() => setRoleChangeSuccess(null), 3000);
  };

  return (
    <div id="turfbd-profile-view" className="max-w-2xl mx-auto px-4 py-6 md:py-10 pb-28">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-zinc-950 p-1 rounded-full border-2 border-zinc-900 shadow">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-black text-white">{currentUser.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {currentUser.role === 'admin' ? 'Super Admin' : currentUser.role === 'owner' ? 'Turf Owner' : 'Player / Customer'}
                  </span>
                  <span className="text-xs text-zinc-400">Bangladesh</span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="self-center sm:self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-zinc-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>

            {/* Contact details */}
            <div className="mt-4 pt-4 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{currentUser.phone}</span>
                {currentUser.isPhoneVerified && (
                  <span className="inline-flex items-center text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
                {currentUser.isEmailVerified && (
                  <span className="inline-flex items-center text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking & Financial Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 text-center">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-1.5">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-lg font-black text-white">{confirmedCount}</div>
          <div className="text-[11px] text-zinc-400 font-medium">Matches Played</div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 text-center">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-1.5">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
          <div className="text-lg font-black text-white">{pendingCount}</div>
          <div className="text-[11px] text-zinc-400 font-medium">Upcoming</div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 text-center">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center mb-1.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-lg font-black text-white">BDT {totalSpent.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-400 font-medium">Total Paid</div>
        </div>
      </div>

      {roleChangeSuccess && (
        <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{roleChangeSuccess}</span>
        </div>
      )}

      {/* Navigation Quick Links */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/80 overflow-hidden mb-6">
        <button
          onClick={() => setActiveTab('my-bookings')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">My Bookings & Match Passes</div>
              <div className="text-xs text-zinc-400">View printable receipts, QR codes & vouchers</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        {/* Turf Owner Portal shortcut */}
        <button
          onClick={() => {
            if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
              handleRoleSwitch('owner');
            }
            setActiveTab('owner-dashboard');
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Turf Owner Dashboard</div>
              <div className="text-xs text-zinc-400">Manage time slots, block hours, view turf revenue</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        {/* Super Admin Panel shortcut */}
        <button
          onClick={() => {
            if (currentUser.role !== 'admin') {
              handleRoleSwitch('admin');
            }
            setActiveTab('admin-panel');
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-zinc-800/40 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Platform Administration</div>
              <div className="text-xs text-zinc-400">Review venues, audit payments & platform settings</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Role Switching for MVP Testing */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-6">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Marketplace Role Switcher (MVP Testing)
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['player', 'owner', 'admin'] as UserRole[]).map((r) => {
            const isCurrent = (r === 'player' && currentUser.role === 'player') || currentUser.role === r;
            return (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isCurrent
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {r === 'player' ? 'Customer' : r === 'owner' ? 'Turf Owner' : 'Super Admin'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Support and Security Note */}
      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-zinc-300">Need help with your turf booking?</p>
          <p className="mt-0.5">
            Contact TurfBD Bangladesh 24/7 hotline at <strong className="text-emerald-400">+880 1912-334455</strong> or email <strong className="text-emerald-400">support@turfbd.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
