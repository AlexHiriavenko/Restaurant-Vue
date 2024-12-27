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

  async function getNotifications(params) {
    notifications.value = await axios.get('notifications');
  }

  async function deleteNotification(notificationId) {
    // Находим индекс и удаляем элемент
    const index = notifications.value.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      notifications.value.splice(index, 1); // Прямое удаление из массива
    }

    try {
      // Отправляем запрос на сервер для удаления
      await axios.delete(`notifications/${notificationId}`);
    } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
    }
  }

  return {
    notifications,
    addNotification,
    getNotifications,
    markAsRead,
    deleteNotification
  };
});
