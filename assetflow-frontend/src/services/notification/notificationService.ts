import { apiClient } from '@/libs/api/api-client';

export type NotificationType =
  | 'ASSET_ASSIGNED'
  | 'ASSET_RETURNED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface MarkNotificationsReadResponse {
  message: string;
  updatedCount: number;
}

export const notificationService = {
  getAll: () =>
    apiClient.get<NotificationResponse>(
      '/notifications',
    ),

  getUnread: () =>
    apiClient.get<Notification[]>(
      '/notifications/unread',
    ),

  markAllAsRead: () =>
    apiClient.patch<MarkNotificationsReadResponse>(
      '/notifications/read',
    ),
};