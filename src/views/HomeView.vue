<template>
  <div class="home-img-container">
    <v-img
      :src="prmImage"
      :width="1160"
      :height="280"
      class="mx-auto"
      cover
      position="left"
    ></v-img>
  </div>
  <v-container
    fluid
    class="home-container d-flex justify-center ga-8 px-0 py-4"
  >
    <SideBar v-if="$vuetify.display.mdAndUp" />
    <DishesMenu />
  </v-container>
</template>

<script setup>
import prmImage from '@/assets/imgs/prm.jpg';
import SideBar from '@/components/SideBar.vue';
import DishesMenu from '@/components/dishes/DishesMenu.vue';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: false
});

window.Echo.connector.pusher.connection.bind('connected', () => {
  console.log('WebSocket connected to Pusher!');
});

window.Echo.connector.pusher.connection.bind('disconnected', () => {
  console.log('WebSocket disconnected from Pusher.');
});

window.Echo.connector.pusher.connection.bind('error', (err) => {
  console.error('WebSocket error:', err);
});

window.Echo.channel('orders').listen('OrderStatusUpdated', (event) => {
  console.log('Event received:', event);
});
</script>
