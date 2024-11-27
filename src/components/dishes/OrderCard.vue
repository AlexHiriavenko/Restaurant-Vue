<template>
  <v-card class="cart-item mb-4 mx-auto">
    <!-- Название и количество -->
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <h3 class="text-h6 text-center mb-6">{{ dish.name }}</h3>
        <p class="text-gray">
          Кількість:
          <v-btn
            icon
            @click="updateQuantity('decrement')"
            :disabled="dish.quantity <= 1"
            class="cart-card-btn ml-2"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <span class="mx-2">{{ dish.quantity }}</span>
          <v-btn
            icon
            @click="updateQuantity('increment')"
            class="cart-card-btn"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            icon
            color="red"
            @click="removeDish"
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
        <li v-if="dish.modifiers.length === 0" class="text-body-2 text-gray">
          без добавок
        </li>
      </ul>
    </v-card-text>

    <!-- Общая стоимость -->
    <v-card-text class="d-flex justify-space-between">
      <span class="text-body-2 text-white">Вартість:</span>
      <span class="text-body-1 text-orange-darken-3">
        {{ dish.total.toFixed(2) }} грн
      </span>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useOrderStore } from '@/stores/orderStore';
import { computed, toRefs } from 'vue';

// Получаем dish и index через пропсы
const props = defineProps({
  dish: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

// Используем стор для управления состоянием
const orderStore = useOrderStore();

// Методы для изменения количества
const updateQuantity = (type) => {
  const updatedDish = { ...props.dish };

  if (type === 'increment') {
    updatedDish.quantity += 1;
    updatedDish.total += updatedDish.totalPerUnit;
  } else if (type === 'decrement' && updatedDish.quantity > 1) {
    updatedDish.quantity -= 1;
    updatedDish.total -= updatedDish.totalPerUnit;
  }

  orderStore.updateCurrentOrder(props.index, updatedDish);
};

// Метод для удаления блюда
const removeDish = () => {
  orderStore.currentOrder.splice(props.index, 1);
};
</script>

<style scoped>
.cart-card-btn {
  cursor: pointer;
}

.modifiers-list {
  padding-left: 16px;
  list-style: disc;
  margin: 0;
}
</style>
