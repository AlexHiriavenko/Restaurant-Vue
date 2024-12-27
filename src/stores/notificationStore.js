import axios from '@/axios/axios';

export const useNotifyStore = defineStore('notifyStore', () => {
  const notifications = ref([]);

  function addNotification(notify) {
    notifications.value = [...notifications.value, notify];
  }

  async function getNotifications(params) {
    notifications.value = await axios.get('notifications');
  }

  async function markAsRead(notificationId) {
    const notification = notifications.value.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.was_read = true;
    }

    try {
      // Обновляем на сервере статус уведомления
      await axios.patch(`notifications/${notificationId}`, {
        was_read: true
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  return {
    notifications,
    addNotification,
    getNotifications
  };
});
