<template>
  <v-container fluid class="views booking">
    <h2
      class="text-h3 text-white text-center py-12 page-title"
      @click="orderStore.getUserOrders()"
    >
      Booking Page
    </h2>
  </v-container>
</template>

<script setup>
import { useOrderStore } from '@/stores/orderStore';

const orderStore = useOrderStore();
</script>
