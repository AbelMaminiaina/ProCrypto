/**
 * Notification Service
 * Handles browser notifications for price alerts
 */

export type NotificationPermission = 'granted' | 'denied' | 'default';

/**
 * Check if notifications are supported in this browser
 */
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

/**
 * Get current notification permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission as NotificationPermission;
};

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported in this browser');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

/**
 * Send a notification
 */
export const sendNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

/**
 * Send a price alert notification
 */
export const sendPriceAlertNotification = (
  symbol: string,
  currentPrice: number,
  targetPrice: number,
  condition: 'above' | 'below'
): Notification | null => {
  const conditionText = condition === 'above' ? 'dépasse' : 'est en dessous de';
  const emoji = condition === 'above' ? '🚀' : '📉';

  return sendNotification(`${emoji} Alerte Prix: ${symbol.toUpperCase()}`, {
    body: `Le prix ${conditionText} votre cible!\nActuel: $${currentPrice.toLocaleString()}\nCible: $${targetPrice.toLocaleString()}`,
    tag: `price-alert-${symbol}`,
    requireInteraction: true,
  });
};

/**
 * Check if notifications are enabled and permission granted
 */
export const areNotificationsEnabled = (): boolean => {
  return isNotificationSupported() && Notification.permission === 'granted';
};

/**
 * Show a test notification
 */
export const sendTestNotification = (): Notification | null => {
  return sendNotification('🔔 Notifications activées!', {
    body: 'Vous recevrez des alertes quand vos prix cibles seront atteints.',
    tag: 'test-notification',
  });
};
