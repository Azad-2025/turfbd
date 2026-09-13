import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { notifications, users, turfs, bookings } from '../../db/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import { notificationService } from '../services/notificationService';

const router = Router();

/**
 * GET /api/notifications
 * Get notifications for authenticated user or role
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req.query.userId ? Number(req.query.userId) : null);
    const role = (req as any).user?.role || (req.query.role as string) || 'customer';
    const limit = req.query.limit ? Number(req.query.limit) : 30;

    let items;
    if (userId) {
      items = await db
        .select()
        .from(notifications)
        .where(
          or(
            eq(notifications.userId, userId),
            eq(notifications.recipientRole, role),
            eq(notifications.recipientRole, 'all')
          )
        )
        .orderBy(desc(notifications.createdAt))
        .limit(limit);
    } else {
      items = await db
        .select()
        .from(notifications)
        .where(
          or(
            eq(notifications.recipientRole, role),
            eq(notifications.recipientRole, 'all')
          )
        )
        .orderBy(desc(notifications.createdAt))
        .limit(limit);
    }

    const unreadCount = items.filter((item) => !item.isRead).length;

    res.json({
      success: true,
      notifications: items,
      unreadCount,
    });
  } catch (err: any) {
    console.error('Failed to fetch notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications', message: err?.message });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid notification id' });
      return;
    }

    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();

    res.json({ success: true, notification: updated });
  } catch (err: any) {
    console.error('Failed to mark notification as read:', err);
    res.status(500).json({ error: 'Failed to update notification', message: err?.message });
  }
});

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read for user or role
 */
router.post('/read-all', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req.body.userId ? Number(req.body.userId) : null);
    const role = (req as any).user?.role || req.body.role || 'customer';

    if (userId) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          or(
            eq(notifications.userId, userId),
            eq(notifications.recipientRole, role),
            eq(notifications.recipientRole, 'all')
          )
        );
    } else {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          or(
            eq(notifications.recipientRole, role),
            eq(notifications.recipientRole, 'all')
          )
        );
    }

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    console.error('Failed to mark all notifications as read:', err);
    res.status(500).json({ error: 'Failed to update notifications', message: err?.message });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid notification id' });
      return;
    }

    await db.delete(notifications).where(eq(notifications.id, id));
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err: any) {
    console.error('Failed to delete notification:', err);
    res.status(500).json({ error: 'Failed to delete notification', message: err?.message });
  }
});

/**
 * POST /api/notifications/seed-sample
 * Creates initial realistic sample notifications for Customer, Owner, and Admin
 */
router.post('/seed-sample', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId ? Number(req.body.userId) : 1;

    // 1. User notification: Booking confirmed
    await notificationService.notifyBookingConfirmed({
      userId,
      bookingId: 101,
      bookingCode: 'TBD-DH-8492',
      turfName: 'Daffodil Turf Arena',
      date: 'Tonight',
      timeSlot: '20:00 - 21:00',
      paymentStatus: 'Token Paid (bKash)',
      tokenPaid: 1000,
      remainingDue: 800,
      location: 'Road 9/A, Dhanmondi R/A, Dhaka',
    });

    // 2. User notification: Payment success
    await notificationService.notifyPaymentSuccess({
      userId,
      bookingId: 101,
      bookingCode: 'TBD-DH-8492',
      amount: 1000,
      gateway: 'bkash',
      transactionId: 'BKH92049182',
      turfName: 'Daffodil Turf Arena',
    });

    // 3. User notification: Match reminder
    await notificationService.notifyMatchReminder({
      userId,
      bookingId: 101,
      turfName: 'Daffodil Turf Arena',
      timeSlot: '20:00 - 21:00',
      location: 'Road 9/A, Dhanmondi R/A, Dhaka',
    });

    // 4. Owner notification: New booking
    await notificationService.notifyOwnerNewBooking({
      ownerId: 2,
      turfId: 1,
      turfName: 'Bashundhara Sports Complex Pitch A',
      bookingId: 102,
      customerName: 'Tanvir Ahmed',
      customerPhone: '+880 1711-234567',
      date: 'Tonight',
      timeSlot: '21:00 - 22:00',
      tokenPaid: 1000,
      remainingDue: 1500,
    });

    // 5. Admin notification: New turf submitted
    await notificationService.notifyAdminTurfRegistered({
      turfId: 3,
      turfName: 'Uttara Box Cricket & Futsal Hub',
      ownerName: 'Shahriar Kabir',
      city: 'Dhaka',
    });

    res.json({ success: true, message: 'Sample notifications seeded successfully' });
  } catch (err: any) {
    console.error('Failed to seed notifications:', err);
    res.status(500).json({ error: 'Failed to seed notifications', message: err?.message });
  }
});

export default router;
