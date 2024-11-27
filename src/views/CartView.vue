<template>
  <v-container class="cart-view pt-12" fluid>
    <h1 class="text-h4 text-white text-center mb-6">Корзина</h1>

    <!-- Список блюд в корзине -->
    <v-row
      v-if="orderStore.currentOrder.length > 0"
      class="mx-auto justify-center"
      style="max-width: 1360px"
    >
      <v-col
        v-for="(dish, index) in orderStore.currentOrder"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <!-- Компонент карточки -->
        <OrderCard :dish="dish" :index="index" />
      </v-col>
    </v-row>

    <!-- Пустая корзина -->
    <p v-else class="text-center text-white text-h6">Кошик поки що пустий</p>

    <!-- Итоговая стоимость -->
    <h2
      v-if="orderStore.currentOrder.length > 0"
      class="text-center text-h4 text-white mt-6"
    >
      Вартість Замовлення: {{ totalOrderPrice.toFixed(2) }} грн
    </h2>

    <!-- Кнопка отправки заказа -->
    <v-card-actions class="d-flex justify-center mt-6">
      <v-btn
        color="yellow darken-3"
        class="submit-order-button details-button"
        :disabled="orderStore.currentOrder.length === 0"
        @click="submitOrder"
      >
        Підтвердити Замовлення
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import OrderCard from '@/components/dishes/OrderCard.vue';

const orderStore = useOrderStore();

// Итоговая стоимость заказа
const totalOrderPrice = computed(() =>
  orderStore.currentOrder.reduce((sum, dish) => sum + dish.total, 0)
);

// Отправка заказа (мок)
const submitOrder = async () => {
  const order = {
    dishes: orderStore.currentOrder,
    total: totalOrderPrice.value
  };

  console.log(order);
  orderStore.resetOrder();
};
</script>
