import React from 'react';
import { Home, Compass, CalendarCheck2, User as UserIcon, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, bookings, setIsAuthModalOpen } = useApp();

  // Active bookings count for badge
  const myActiveBookingsCount = currentUser
    ? bookings.filter(
        (b) => b.userId === currentUser.id && (b.status === 'confirmed' || b.status === 'pending_approval')
      ).length
    : 0;

  const handleTabClick = (tab: 'home' | 'explore' | 'my-bookings' | 'profile') => {
    if (tab === 'profile' && !currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab(tab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomeActive = activeTab === 'browse' || (activeTab as string) === 'home';
  const isExploreActive = (activeTab as string) === 'explore';
  const isBookingsActive = activeTab === 'my-bookings';
  const isProfileActive = (activeTab as string) === 'profile';

  return (
    <nav
      id="turfbd-mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      {/* Mini role shortcut if user is owner or admin */}
      {currentUser && (currentUser.role === 'owner' || currentUser.role === 'admin') && (
        <div className="bg-emerald-950/80 border-b border-emerald-800/40 px-3 py-1 flex items-center justify-between text-[11px] text-emerald-300">
          <span className="flex items-center gap-1.5 font-medium">
            {currentUser.role === 'admin' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Admin Session</span>
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Turf Owner Session</span>
              </>
            )}
          </span>
          <button
            onClick={() => setActiveTab(currentUser.role === 'admin' ? 'admin-panel' : 'owner-dashboard')}
            className="text-emerald-400 font-bold hover:underline"
          >
            Open Dashboard →
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-2">
        {/* Tab 1: Home */}
        <button
          id="mobile-nav-home-btn"
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${
            isHomeActive ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform duration-200 ${isHomeActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </div>
          <span className={`text-[11px] tracking-tight ${isHomeActive ? 'font-bold' : 'font-normal'}`}>
            Home
          </span>
        </button>

        {/* Tab 2: Explore / Search */}
        <button
          id="mobile-nav-explore-btn"
          onClick={() => handleTabClick('explore')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${
            isExploreActive ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Compass className={`w-5 h-5 transition-transform duration-200 ${isExploreActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
            {isExploreActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </div>
          <span className={`text-[11px] tracking-tight ${isExploreActive ? 'font-bold' : 'font-normal'}`}>
            Explore
          </span>
        </button>

        {/* Tab 3: My Booking */}
        <button
          id="mobile-nav-bookings-btn"
          onClick={() => handleTabClick('my-bookings')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${
            isBookingsActive ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <CalendarCheck2 className={`w-5 h-5 transition-transform duration-200 ${isBookingsActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
            {myActiveBookingsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {myActiveBookingsCount}
              </span>
            )}
            {isBookingsActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </div>
          <span className={`text-[11px] tracking-tight ${isBookingsActive ? 'font-bold' : 'font-normal'}`}>
            My Booking
          </span>
        </button>

        {/* Tab 4: Profile */}
        <button
          id="mobile-nav-profile-btn"
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${
            isProfileActive ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className={`w-5 h-5 rounded-full object-cover border ${
                  isProfileActive ? 'border-emerald-400 ring-2 ring-emerald-500/30' : 'border-zinc-700'
                }`}
              />
            ) : (
              <UserIcon className={`w-5 h-5 transition-transform duration-200 ${isProfileActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
            )}
            {isProfileActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </div>
          <span className={`text-[11px] tracking-tight ${isProfileActive ? 'font-bold' : 'font-normal'}`}>
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
