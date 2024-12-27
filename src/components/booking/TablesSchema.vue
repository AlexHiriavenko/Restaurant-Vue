<template>
  <div style="max-width: 300px; background-color: darkslategray" class="pa-6">
    <!-- Столик 10 -->
    <h3 class="text-h5 text-white text-center page-title mb-4">
      Схема Розміщення:
    </h3>
    <v-row justify="center">
      <v-col cols="12" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="110px"
          height="50px"
          @click="openTableModal(10)"
        >
          10
        </v-card>
      </v-col>
    </v-row>
    <!-- Столик 9 -->
    <v-row justify="center">
      <v-col cols="12" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="110px"
          height="50px"
          @click="openTableModal(9)"
        >
          9
        </v-card>
      </v-col>
    </v-row>
    <!-- Ряды столиков 1-8 -->
    <v-row>
      <!-- Столик 1 -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="40px"
          height="40px"
          @click="openTableModal(1)"
        >
          1
        </v-card>
      </v-col>
      <!-- Столик 5 -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="65px"
          height="40px"
          @click="openTableModal(5)"
        >
          5
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <!-- Столик 2 -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="40px"
          height="40px"
          @click="openTableModal(2)"
        >
          2
        </v-card>
      </v-col>
      <!-- Столик 6 -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="65px"
          height="40px"
          @click="openTableModal(6)"
        >
          6
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <!-- Столик 3 -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="40px"
          height="40px"
          @click="openTableModal(3)"
        >
          3
        </v-card>
      </v-col>
      <!-- Столик 7 -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="65px"
          height="40px"
          @click="openTableModal(7)"
        >
          7
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <!-- Столик 4 -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="40px"
          height="40px"
          @click="openTableModal(4)"
        >
          4
        </v-card>
      </v-col>
      <!-- Столик 8 -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center cursor-pointer"
          width="65px"
          height="40px"
          @click="openTableModal(8)"
        >
          8
        </v-card>
      </v-col>
    </v-row>
    <!-- Вход -->
    <v-row justify="center">
      <v-col cols="6" class="d-flex justify-center">
        <v-card
          outlined
          class="d-flex justify-center align-center"
          width="65px"
          height="40px"
          >Вхід</v-card
        >
      </v-col>
    </v-row>
  </div>

  <!-- Модальное окно -->
  <ModalDialog ref="modalRef">
    <template #modal-content>
      <v-container class="d-flex flex-column align-center justify-center">
        <v-card-title class="text-h5">
          Столік № {{ selectedTable.number }}
        </v-card-title>
        <v-card-subtitle class="text-h5">
          Кількість персон: {{ selectedTable.seats }}
        </v-card-subtitle>
        <div v-if="reservations.length">
          <div
            v-for="reservation in reservations"
            :key="reservation.id"
            class="text-red"
          >
            заброньовано з {{ reservation.start_time }} до
            {{ reservation.end_time }}
          </div>
        </div>
        <v-img
          :src="selectedTable.img"
          :width="220"
          :height="220"
          class="mx-auto pa-6 my-6"
          cover
        ></v-img>
        <v-btn
          text="OK"
          color="success"
          @click="modalRef.closeModal()"
          v-focus
        ></v-btn>
      </v-container>
    </template>
  </ModalDialog>
</template>

<script setup>
import twoSeatsImg from '@/assets/imgs/two-seats.webp';
import fourSeatsImg from '@/assets/imgs/four-seats.webp';
import sixSeatsImg from '@/assets/imgs/six-seats.webp';
import { useBookingStore } from '@/stores/bookingStore';

const bookingStore = useBookingStore();
const modalRef = ref(null);
const reservations = ref([]);

const tables = [
  { number: 1, seats: '1..2', img: twoSeatsImg },
  { number: 2, seats: '1..2', img: twoSeatsImg },
  { number: 3, seats: '1..2', img: twoSeatsImg },
  { number: 4, seats: '1..2', img: twoSeatsImg },
  { number: 5, seats: '3..4', img: fourSeatsImg },
  { number: 6, seats: '3..4', img: fourSeatsImg },
  { number: 7, seats: '3..4', img: fourSeatsImg },
  { number: 8, seats: '3..4', img: fourSeatsImg },
  { number: 9, seats: '5..8', img: sixSeatsImg },
  { number: 10, seats: '5..8', img: sixSeatsImg }
];

const selectedTable = ref({ number: '', seats: '', img: '' });

async function openTableModal(tableNumber) {
  const table = tables.find((t) => t.number === tableNumber);
  if (table) {
    selectedTable.value = table;
    modalRef.value.openModal();
    reservations.value = await bookingStore.getBookingByDate(
      table.number,
      localStorage.getItem('selectedDate')
    );
  }
}
</script>
