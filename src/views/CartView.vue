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
        <v-card class="cart-item mb-4 mx-auto">
          <!-- Название и количество -->
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-h6 text-center mb-6">{{ dish.name }}</h3>
              <p class="text-gray">
                Кількість:
                <v-btn
                  icon
                  @click="updateQuantity(index, dish, 'decrement')"
                  :disabled="dish.quantity <= 1"
                  class="cart-card-btn ml-2"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span class="mx-2">{{ dish.quantity }}</span>
                <v-btn
                  icon
                  @click="updateQuantity(index, dish, 'increment')"
                  class="cart-card-btn"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="red"
                  @click="removeDish(index)"
                  class="cart-card-btn ml-6"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </p>
            </div>
          </v-card-title>

          <!-- Модификаторы -->
          <v-card-text>
            <p class="text-body-2 text-white">Добавки:</p>
            <ul class="modifiers-list">
              <li
                v-for="modifier in dish.modifiers"
                :key="modifier.id"
                class="text-body-2 text-gray"
              >
                {{ modifier.name }}
              </li>
              <li
                v-if="dish.modifiers.length === 0"
                class="text-body-2 text-gray"
              >
                без добавок
              </li>
            </ul>
          </v-card-text>

          <!-- Общая стоимость -->
          <v-card-text class="d-flex justify-space-between">
            <span class="text-body-2 text-white">Вартість:</span>
            <span class="text-body-1 text-orange-darken-3"
              >{{ dish.total.toFixed(2) }} грн</span
            >
          </v-card-text>
        </v-card>
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
        class="submit-order-button"
        :disabled="orderStore.currentOrder.length === 0"
        @click="submitOrder"
      >
        Отправить заказ
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import { useOrderStore } from '@/stores/orderStore';

const orderStore = useOrderStore();

// Обновление количества
const updateQuantity = (index, dish, type) => {
  // Создаём обновлённый объект блюда
  const updatedDish = { ...dish };

  // Увеличиваем или уменьшаем количество
  if (type === 'increment') {
    updatedDish.quantity += 1;
    updatedDish.total += updatedDish.totalPerUnit;
  } else if (type === 'decrement' && updatedDish.quantity > 1) {
    updatedDish.quantity -= 1;
    updatedDish.total -= updatedDish.totalPerUnit;
  }

  // Передаём обновлённый объект в стор
  orderStore.updateCurrentOrder(index, updatedDish);
};

// Удаление блюда из корзины
const removeDish = (index) => {
  orderStore.currentOrder.splice(index, 1);
};

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
