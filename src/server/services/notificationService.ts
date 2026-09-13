import { db } from '../../db';
import { notifications, turfs, bookings, users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { realtimeBroadcaster } from './realtime.js';

export interface NotificationPayload {
  userId?: number | null;
  recipientRole?: 'customer' | 'owner' | 'admin' | 'all';
  type: string;
  title: string;
  message: string;
  bookingId?: number | null;
  turfId?: number | null;
  metadata?: Record<string, any>;
}

export class NotificationService {
  /**
   * Core dispatch function:
   * 1. Inserts record into database
   * 2. Broadcasts real-time event through SSE
   * 3. Logs future-ready WhatsApp/SMS delivery channel
   */
  public async createNotification(payload: NotificationPayload) {
    try {
      let inserted: any;
      try {
        const [res] = await db
          .insert(notifications)
          .values({
            userId: payload.userId || null,
            recipientRole: payload.recipientRole || 'customer',
            type: payload.type,
            title: payload.title,
            message: payload.message,
            bookingId: payload.bookingId || null,
            turfId: payload.turfId || null,
            metadata: payload.metadata || {},
            isRead: false,
          })
          .returning();
        inserted = res;
      } catch (fkErr: any) {
        // Fallback if foreign key is not found (e.g. simulated booking ID)
        console.warn('[NotificationService] Retrying insert with sanitized foreign keys:', fkErr?.message);
        const [res] = await db
          .insert(notifications)
          .values({
            userId: payload.userId || null,
            recipientRole: payload.recipientRole || 'customer',
            type: payload.type,
            title: payload.title,
            message: payload.message,
            bookingId: null,
            turfId: null,
            metadata: {
              ...payload.metadata,
              originalBookingId: payload.bookingId,
              originalTurfId: payload.turfId,
            },
            isRead: false,
          })
          .returning();
        inserted = res;
      }

      // Realtime live push via SSE
      realtimeBroadcaster.notifyNotification({
        id: inserted.id,
        userId: inserted.userId,
        recipientRole: inserted.recipientRole,
        type: inserted.type,
        title: inserted.title,
        message: inserted.message,
        bookingId: inserted.bookingId,
        turfId: inserted.turfId,
        metadata: inserted.metadata,
        isRead: inserted.isRead,
        createdAt: inserted.createdAt,
      });

      // Future-Ready Multi-Channel Dispatch (SMS / WhatsApp Gateway logging)
      if (payload.metadata?.phone) {
        console.log(
          `[TurfBD Notification Gateway] Dispatched multi-channel alert: type=${payload.type}, recipientPhone=${payload.metadata.phone}`
        );
      }

      return inserted;
    } catch (err) {
      console.error('[NotificationService] Error creating notification:', err);
      return null;
    }
  }

  // ==========================================
  // A) USER NOTIFICATIONS
  // ==========================================

  public async notifyBookingConfirmed(params: {
    userId: number;
    bookingId: number;
    bookingCode: string;
    turfName: string;
    date: string;
    timeSlot: string;
    paymentStatus: string;
    tokenPaid: number;
    remainingDue: number;
    location: string;
    userPhone?: string;
  }) {
    return this.createNotification({
      userId: params.userId,
      recipientRole: 'customer',
      type: 'booking_confirmed',
      title: 'Booking Confirmed! ⚽🏏',
      message: `Your slot at ${params.turfName} on ${params.date} (${params.timeSlot}) is locked. Advance ৳${params.tokenPaid.toLocaleString()} paid.`,
      bookingId: params.bookingId,
      metadata: {
        bookingCode: params.bookingCode,
        turfName: params.turfName,
        date: params.date,
        timeSlot: params.timeSlot,
        paymentStatus: params.paymentStatus,
        tokenPaid: params.tokenPaid,
        remainingDue: params.remainingDue,
        location: params.location,
        phone: params.userPhone,
        brandLogo: '/turflogo.png',
      },
    });
  }

  public async notifyPaymentSuccess(params: {
    userId: number;
    bookingId: number;
    bookingCode: string;
    amount: number;
    gateway: 'bkash' | 'nagad';
    transactionId: string;
    turfName: string;
  }) {
    return this.createNotification({
      userId: params.userId,
      recipientRole: 'customer',
      type: 'payment_success',
      title: 'Payment Successful ৳',
      message: `Advance payment of ৳${params.amount.toLocaleString()} received via ${params.gateway.toUpperCase()} (TrxID: ${params.transactionId}).`,
      bookingId: params.bookingId,
      metadata: {
        bookingCode: params.bookingCode,
        amount: params.amount,
        gateway: params.gateway,
        transactionId: params.transactionId,
        turfName: params.turfName,
      },
    });
  }

  public async notifyPaymentFailed(params: {
    userId: number;
    bookingId?: number;
    gateway: 'bkash' | 'nagad';
    reason: string;
  }) {
    return this.createNotification({
      userId: params.userId,
      recipientRole: 'customer',
      type: 'payment_failed',
      title: 'Payment Failed or Cancelled',
      message: `Your ${params.gateway.toUpperCase()} transaction could not be completed: ${params.reason}. Please retry to protect your slot.`,
      bookingId: params.bookingId,
      metadata: {
        gateway: params.gateway,
        reason: params.reason,
      },
    });
  }

  public async notifyBookingCancelled(params: {
    userId: number;
    bookingId: number;
    bookingCode: string;
    turfName: string;
    date: string;
    timeSlot: string;
    refundAmount?: number;
  }) {
    return this.createNotification({
      userId: params.userId,
      recipientRole: 'customer',
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your booking #${params.bookingCode} at ${params.turfName} has been cancelled.${
        params.refundAmount ? ` Refund of ৳${params.refundAmount.toLocaleString()} initiated.` : ''
      }`,
      bookingId: params.bookingId,
      metadata: {
        bookingCode: params.bookingCode,
        turfName: params.turfName,
        date: params.date,
        timeSlot: params.timeSlot,
        refundAmount: params.refundAmount,
      },
    });
  }

  public async notifyRefundCompleted(params: {
    userId: number;
    bookingId: number;
    amount: number;
    gateway: string;
    refundRef: string;
  }) {
    return this.createNotification({
      userId: params.userId,
      recipientRole: 'customer',
      type: 'refund_completed',
      title: 'Refund Completed ৳',
      message: `Refund of ৳${params.amount.toLocaleString()} has been sent to your ${params.gateway.toUpperCase()} account (Ref: ${params.refundRef}).`,
      bookingId: params.bookingId,
      metadata: {
        amount: params.amount,
        gateway: params.gateway,
        refundRef: params.refundRef,
      },
    });
  }

  public async notifyMatchReminder(params: {
    userId: number;
    bookingId: number;
    turfName: string;
    timeSlot: string;
    location: string;
  }) {
    return this.createNotification({
      userId: params.userId,
      recipientRole: 'customer',
      type: 'match_reminder',
      title: 'Upcoming Match Reminder! 🏆',
      message: `Kickoff at ${params.turfName} (${params.timeSlot}) is approaching. Gather your squad!`,
      bookingId: params.bookingId,
      metadata: {
        turfName: params.turfName,
        timeSlot: params.timeSlot,
        location: params.location,
      },
    });
  }

  // ==========================================
  // B) TURF OWNER NOTIFICATIONS
  // ==========================================

  public async notifyOwnerNewBooking(params: {
    ownerId: number;
    turfId: number;
    turfName: string;
    bookingId: number;
    customerName: string;
    customerPhone: string;
    date: string;
    timeSlot: string;
    tokenPaid: number;
    remainingDue: number;
  }) {
    return this.createNotification({
      userId: params.ownerId,
      recipientRole: 'owner',
      type: 'owner_new_booking',
      title: 'New Booking Confirmed! 🏟️',
      message: `${params.customerName} booked ${params.turfName} on ${params.date} (${params.timeSlot}). Token ৳${params.tokenPaid.toLocaleString()} paid.`,
      bookingId: params.bookingId,
      turfId: params.turfId,
      metadata: {
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        turfName: params.turfName,
        date: params.date,
        timeSlot: params.timeSlot,
        tokenPaid: params.tokenPaid,
        remainingDue: params.remainingDue,
      },
    });
  }

  public async notifyOwnerAdvancePaid(params: {
    ownerId: number;
    turfName: string;
    bookingId: number;
    amount: number;
    gateway: string;
  }) {
    return this.createNotification({
      userId: params.ownerId,
      recipientRole: 'owner',
      type: 'owner_advance_paid',
      title: 'Advance Payment Credited ৳',
      message: `Advance payment of ৳${params.amount.toLocaleString()} received via ${params.gateway.toUpperCase()} for ${params.turfName}.`,
      bookingId: params.bookingId,
      metadata: {
        turfName: params.turfName,
        amount: params.amount,
        gateway: params.gateway,
      },
    });
  }

  public async notifyOwnerCancellation(params: {
    ownerId: number;
    turfName: string;
    bookingId: number;
    customerName: string;
    date: string;
    timeSlot: string;
  }) {
    return this.createNotification({
      userId: params.ownerId,
      recipientRole: 'owner',
      type: 'owner_cancellation',
      title: 'Slot Cancelled by Customer',
      message: `${params.customerName} cancelled their slot for ${params.date} (${params.timeSlot}) at ${params.turfName}. Slot is now open again.`,
      bookingId: params.bookingId,
      metadata: {
        turfName: params.turfName,
        customerName: params.customerName,
        date: params.date,
        timeSlot: params.timeSlot,
      },
    });
  }

  public async notifyOwnerRefundRequest(params: {
    ownerId: number;
    turfName: string;
    bookingId: number;
    customerName: string;
    amount: number;
  }) {
    return this.createNotification({
      userId: params.ownerId,
      recipientRole: 'owner',
      type: 'owner_refund_request',
      title: 'Refund Request Received',
      message: `${params.customerName} requested a refund of ৳${params.amount.toLocaleString()} for ${params.turfName}.`,
      bookingId: params.bookingId,
      metadata: {
        turfName: params.turfName,
        customerName: params.customerName,
        amount: params.amount,
      },
    });
  }

  // ==========================================
  // C) ADMIN NOTIFICATIONS
  // ==========================================

  public async notifyAdminTurfRegistered(params: {
    turfId: number;
    turfName: string;
    ownerName: string;
    city: string;
  }) {
    return this.createNotification({
      recipientRole: 'admin',
      type: 'admin_turf_registered',
      title: 'New Turf Submitted for Verification 📝',
      message: `${params.ownerName} submitted "${params.turfName}" in ${params.city} for platform verification.`,
      turfId: params.turfId,
      metadata: {
        turfName: params.turfName,
        ownerName: params.ownerName,
        city: params.city,
      },
    });
  }

  public async notifyAdminPaymentIssue(params: {
    bookingId?: number;
    gateway: string;
    errorDetail: string;
  }) {
    return this.createNotification({
      recipientRole: 'admin',
      type: 'admin_payment_issue',
      title: 'Payment Gateway Alert ⚠️',
      message: `Gateway ${params.gateway.toUpperCase()} reported an issue: ${params.errorDetail}`,
      bookingId: params.bookingId,
      metadata: {
        gateway: params.gateway,
        errorDetail: params.errorDetail,
      },
    });
  }

  public async notifyAdminRefundRequest(params: {
    bookingId: number;
    customerName: string;
    amount: number;
    reason: string;
  }) {
    return this.createNotification({
      recipientRole: 'admin',
      type: 'admin_refund_request',
      title: 'Dispute / Refund Verification Required',
      message: `Customer ${params.customerName} requested refund ৳${params.amount.toLocaleString()}. Reason: ${params.reason}`,
      bookingId: params.bookingId,
      metadata: {
        customerName: params.customerName,
        amount: params.amount,
        reason: params.reason,
      },
    });
  }
}

export const notificationService = new NotificationService();
