<template>
  <v-layout>
    <HeaderApp />
    <v-main>
      <LoaderSpinner :is-loading="false" :color="'white'" :size="70" />
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup>
import HeaderApp from '@/components/HeaderApp.vue';
import { useDishesStore } from '@/stores/dishesStore';
import { useUserStore } from './stores/userStore';
import { echo, pusher } from '@/plugins/echo';
import { useNotifyStore } from '@/stores/notificationStore';
import { useOrderStore } from '@/stores/orderStore';

const dishesStore = useDishesStore();
const userStore = useUserStore();
const notifyStore = useNotifyStore();
const orderStore = useOrderStore();

onMounted(async () => {
  if (!dishesStore.dishesCategories.length) {
    await dishesStore.getDishesCategories();
  }

  if (!userStore.currentUser) {
    await userStore.getUser();
  }

  // await notifyStore.getNotifications();
});

echo.connector.pusher.connection.bind('connected', () => {
  console.log('WebSocket connected to Pusher!');
});

echo.connector.pusher.connection.bind('disconnected', () => {
  console.log('WebSocket disconnected from Pusher.');
});

echo.connector.pusher.connection.bind('error', (err) => {
  console.error('WebSocket error:', err);
  if (err?.error?.data?.code === 4200) {
    console.log('Attempting to reconnect...');
    pusher.connect();
  }
});

echo.channel('orders').listen('OrderStatusUpdated', (event) => {
  console.log(event);
  const notify = {
    id: event.id,
    text: event.notifyMessage
  };

  notifyStore.addNotification(notify);

  const status = event.order_status;
  const id = event.order_id;

  orderStore.updateOrderStatus(id, status);
});
</script>
