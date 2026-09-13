import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AppNotification } from '../types';
import { TurfBDLogo } from './TurfBDLogo';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Building2,
  MapPin,
  RefreshCw,
  X,
  User as UserIcon,
} from 'lucide-react';

interface NotificationBellProps {
  onOpenHistory?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onOpenHistory }) => {
  const { currentUser, setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'customer' | 'owner' | 'admin'>('all');
  const [isSeeding, setIsSeeding] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const role = currentUser?.role === 'admin' ? 'admin' : currentUser?.role === 'owner' ? 'owner' : 'customer';
      const res = await api.getNotifications({
        userId: currentUser?.id ? Number(currentUser.id) : 1,
        role,
        limit: 30,
      });

      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and fetch when user or role changes
  useEffect(() => {
    fetchNotifications();
  }, [currentUser?.id, currentUser?.role]);

  // Real-time SSE listener for new notifications
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/realtime/events');

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'NOTIFICATION_RECEIVED' && parsed.data) {
            const newNotif: AppNotification = parsed.data;

            setNotifications((prev) => {
              // Avoid duplicate insertion
              if (prev.some((n) => n.id === newNotif.id)) return prev;
              return [newNotif, ...prev];
            });

            setUnreadCount((prev) => prev + 1);
          }
        } catch {
          // Ignored
        }
      };
    } catch {
      // Ignored
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mark single as read
  const handleMarkRead = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const role = currentUser?.role === 'admin' ? 'admin' : currentUser?.role === 'owner' ? 'owner' : 'customer';
      await api.markAllNotificationsRead({
        userId: currentUser?.id ? Number(currentUser.id) : 1,
        role,
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // Delete notification
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => {
        const item = prev.find((n) => n.id === id);
        if (item && !item.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Seed sample demo notifications
  const handleSeedSamples = async () => {
    try {
      setIsSeeding(true);
      await api.seedSampleNotifications(currentUser?.id ? Number(currentUser.id) : 1);
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to seed notifications:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Format relative time helper
  const getRelativeTime = (isoString: string) => {
    try {
      const diff = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Type styling and icon resolver
  const getNotificationVisuals = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          badgeText: 'Confirmed',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        };
      case 'payment_success':
        return {
          icon: <CreditCard className="w-4 h-4 text-emerald-400" />,
          bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          badgeText: 'Payment',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        };
      case 'payment_failed':
        return {
          icon: <XCircle className="w-4 h-4 text-red-400" />,
          bgColor: 'bg-red-500/10 border-red-500/30 text-red-300',
          badgeText: 'Failed',
          badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
        };
      case 'match_reminder':
        return {
          icon: <Clock className="w-4 h-4 text-cyan-400" />,
          bgColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          badgeText: 'Reminder',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
        };
      case 'booking_cancelled':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          badgeText: 'Cancelled',
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        };
      case 'refund_completed':
        return {
          icon: <CreditCard className="w-4 h-4 text-blue-400" />,
          bgColor: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
          badgeText: 'Refunded',
          badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        };
      case 'owner_new_booking':
      case 'owner_advance_paid':
        return {
          icon: <Building2 className="w-4 h-4 text-amber-400" />,
          bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          badgeText: 'Owner Alert',
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        };
      case 'admin_turf_registered':
      case 'admin_payment_issue':
      case 'admin_refund_request':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
          bgColor: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
          badgeText: 'Admin Log',
          badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-neutral-400" />,
          bgColor: 'bg-neutral-800 border-neutral-700 text-neutral-300',
          badgeText: 'Notice',
          badgeColor: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
        };
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'customer') return n.recipientRole === 'customer' || n.recipientRole === 'all';
    if (activeFilter === 'owner') return n.recipientRole === 'owner';
    if (activeFilter === 'admin') return n.recipientRole === 'admin';
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef} id="notification-bell-container">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-750 border border-neutral-700/60 transition-colors focus:outline-none"
        title="Notifications"
        id="notification-bell-btn"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-200" />

        {/* Unread badge with neon pulse */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-extrabold text-neutral-950 shadow-md ring-2 ring-neutral-900 animate-pulse"
            id="notification-unread-badge"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-84 sm:w-96 max-w-[92vw] bg-[#12161a] border border-neutral-800/90 rounded-2xl shadow-2xl p-0 z-50 overflow-hidden text-neutral-200 font-sans backdrop-blur-xl"
          id="notification-dropdown-panel"
        >
          {/* Header */}
          <div className="p-3.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-950 flex items-center justify-center border border-neutral-800 shadow-inner">
                <TurfBDLogo layout="icon-only" size="sm" variant="dark" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-neutral-400">Match updates, payments & receipts</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-2 py-1 text-[11px] font-medium text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1"
                  title="Mark all as read"
                  id="notif-mark-all-read-btn"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="px-3 pt-2.5 pb-2 bg-neutral-900/60 border-b border-neutral-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('customer')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeFilter === 'customer'
                  ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              User Alerts
            </button>
            <button
              onClick={() => setActiveFilter('owner')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeFilter === 'owner'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Turf Owner
            </button>
            <button
              onClick={() => setActiveFilter('admin')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeFilter === 'admin'
                  ? 'bg-neutral-800 text-purple-400 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Notification List Body */}
          <div
            className="max-h-[380px] overflow-y-auto divide-y divide-neutral-800/60"
            id="notification-items-list"
          >
            {loading ? (
              <div className="p-8 text-center text-neutral-400 text-xs flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                <span>Loading notifications...</span>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-neutral-800/80 flex items-center justify-center mb-2.5 text-neutral-400">
                  <Bell className="w-5 h-5 text-neutral-500" />
                </div>
                <p className="text-xs font-semibold text-neutral-300">No notifications yet</p>
                <p className="text-[11px] text-neutral-500 mt-1 max-w-[220px]">
                  When you book a turf, make advance token payments, or receive slot updates, they will appear here.
                </p>
                <button
                  onClick={handleSeedSamples}
                  disabled={isSeeding}
                  className="mt-3.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  id="seed-sample-notifications-btn"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSeeding ? 'Generating...' : 'Seed Sample Alerts'}</span>
                </button>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const visuals = getNotificationVisuals(notif.type);
                const meta = notif.metadata || {};

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.isRead) handleMarkRead(notif.id);
                    }}
                    className={`p-3 sm:p-3.5 transition-colors cursor-pointer relative group ${
                      notif.isRead
                        ? 'bg-transparent hover:bg-neutral-850/50'
                        : 'bg-neutral-800/30 hover:bg-neutral-800/60'
                    }`}
                    id={`notif-card-${notif.id}`}
                  >
                    {/* Unread indicator dot */}
                    {!notif.isRead && (
                      <span className="absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
                    )}

                    <div className="flex items-start gap-3 pl-1.5">
                      {/* Visual Icon Badge */}
                      <div className={`p-2 rounded-xl flex-shrink-0 border ${visuals.bgColor}`}>
                        {visuals.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${visuals.badgeColor}`}>
                            {visuals.badgeText}
                          </span>
                          <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(notif.createdAt)}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-neutral-100 leading-snug">
                          {notif.title}
                        </h4>

                        <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Structured Metadata Card for booking/payment */}
                        {(meta.turfName || meta.bookingCode || meta.tokenPaid || meta.amount) && (
                          <div className="mt-2 p-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-[11px] space-y-1">
                            {meta.turfName && (
                              <div className="flex items-center gap-1.5 text-neutral-200 font-semibold truncate">
                                <Building2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                <span className="truncate">{meta.turfName}</span>
                              </div>
                            )}

                            {meta.date && meta.timeSlot && (
                              <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                                <Calendar className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                                <span>{meta.date} • {meta.timeSlot}</span>
                              </div>
                            )}

                            {meta.location && (
                              <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] truncate">
                                <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                                <span className="truncate">{meta.location}</span>
                              </div>
                            )}

                            <div className="pt-1 mt-1 border-t border-neutral-800 flex items-center justify-between text-[10px]">
                              {meta.bookingCode && (
                                <span className="font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                                  #{meta.bookingCode}
                                </span>
                              )}
                              {meta.tokenPaid !== undefined && (
                                <span className="text-neutral-300">
                                  Paid: <strong className="text-emerald-400">৳{Number(meta.tokenPaid).toLocaleString()}</strong>
                                  {meta.remainingDue > 0 && ` (Due: ৳${Number(meta.remainingDue).toLocaleString()})`}
                                </span>
                              )}
                              {meta.amount && !meta.tokenPaid && (
                                <span className="text-emerald-400 font-bold">
                                  ৳{Number(meta.amount).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Card action buttons */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {notif.bookingId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsOpen(false);
                                  setActiveTab('my-bookings');
                                }}
                                className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                              >
                                <span>View Match</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {!notif.isRead && (
                              <button
                                onClick={(e) => handleMarkRead(notif.id, e)}
                                className="p-1 text-neutral-400 hover:text-emerald-400 rounded transition-colors"
                                title="Mark as read"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(notif.id, e)}
                              className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors opacity-60 group-hover:opacity-100"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs">
            <button
              onClick={handleSeedSamples}
              disabled={isSeeding}
              className="text-[11px] font-medium text-neutral-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              title="Inject demo notifications to test all workflows"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{isSeeding ? 'Generating...' : 'Simulate Alerts'}</span>
            </button>

            {onOpenHistory && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenHistory();
                }}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                id="view-all-notifications-link"
              >
                View Full History →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
