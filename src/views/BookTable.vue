<template>
  <v-container fluid class="views booking">
    <h2 class="text-h3 text-white text-center py-4 page-title">
      Бронювання столиків
    </h2>
    <div class="d-flex justify-center ga-12 flex-wrap mb-6 mt-6">
      <TableSchema />
      <BookingForm />
    </div>
  </v-container>
</template>

<script setup>
import TableSchema from '@/components/booking/TablesSchema.vue';
import BookingForm from '@/components/booking/BookingForm.vue';
</script>
