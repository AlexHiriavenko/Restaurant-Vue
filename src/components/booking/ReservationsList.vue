<template>
  <div
    style="max-height: 560px; overflow-y: auto; min-width: 320px"
    class="px-4 pb-4"
  >
    <h2 class="text-h5 text-center text-white mb-4 px-2 pt-4">
      Поточні Бронювання:
    </h2>
    <div class="d-flex justify-center align-center">
      <LoaderSpinner
        :isLoading="isLoading"
        :isFixed="false"
        :size="70"
        color="white"
      />
    </div>
    <div v-if="!isLoading">
      <v-card
        v-for="reservation in bookingStore.userReservations"
        :key="reservation.id"
        class="pa-2 mt-4 reservation-card"
      >
        <v-card-title>Дата: {{ reservation.reservation_date }}</v-card-title>
        <v-card-text>Столик № {{ reservation.table_id }}</v-card-text>
        <v-card-text>Час: {{ reservation.start_time }}</v-card-text>
        <v-card-actions>
          <v-btn
            @click="cancelReservation(reservation.id)"
            class="details-button"
            color="yellow darken-3"
            block
          >
            Відмінити
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from '@/stores/bookingStore';
import { onMounted } from 'vue';

const bookingStore = useBookingStore();
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  await bookingStore.getUserReservations();
  isLoading.value = false;
});

async function cancelReservation(id) {
  isLoading.value = true;
  try {
    await bookingStore.cancelReservation(id);
    await bookingStore.getUserReservations();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style>
.reservation-card .v-card-text {
  padding-block: 8px;
}
</style>
