export enum AppType {
  ALL = 'ALL',
  Business = 'BUSINESS',
  NameRequest = 'NAMEREQUEST',
  PPR = 'PPR'
}

export enum NotificationLabel {
  NEW = 'New Feature',
  IMPROVEMENT = 'Improvement',
  ANNOUNCEMENT = 'Announcement'
}

export interface Notification {
  id: number;
  date: string;
  expiryDate?: string;
  labels?: NotificationLabel[];
  title: string;
  description: string;
  app: AppType;
  priority: boolean;
  read: boolean;
}

export type Notifications = Notification[];
