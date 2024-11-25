<template>
  <v-card class="dish-card mx-auto" elevation="2">
    <!-- Лейба скидки -->
    <div v-if="dish.discount_percent" class="discount-label">
      <div>Знижка</div>
      <div>{{ dish.discount_percent }}%</div>
    </div>

    <!-- Изображение блюда -->
    <v-img :src="dish.img" :alt="dish.name" class="dish-image" />

    <!-- Контент карточки -->
    <v-card-text class="dish-details">
      <!-- Название блюда -->
      <h3 class="dish-name">{{ dish.name }}</h3>

      <!-- Описание блюда -->
      <p class="dish-description">{{ dish.description }}</p>

      <!-- Итоговая цена -->
      <p class="dish-price">{{ dish.final_price }} грн</p>
    </v-card-text>

    <!-- Кнопка -->
    <v-card-actions>
      <v-btn class="add-to-cart-button" color="yellow darken-3" block>
        Замовити
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
// Пропс для передачи данных карточки
const props = defineProps({
  dish: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      name: '',
      description: '',
      final_price: 0,
      img: '',
      category: '',
      discount_percent: null // Скидка
    })
  }
});
</script>

<style scoped>
/* Общий стиль карточки */
.dish-card {
  width: 100%;
  height: 460px;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  position: relative; /* Для размещения лейбы с абсолютным позиционированием */
}

/* Лейба скидки */
.discount-label {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 84px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: orangered;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  line-height: 1.3;
  padding: 4px;
  border-radius: 50%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  aspect-ratio: 1;
  clip-path: polygon(
    100% 50%,
    78.98% 57.76%,
    93.3% 75%,
    71.21% 71.21%,
    75% 93.3%,
    57.76% 78.98%,
    50% 100%,
    42.24% 78.98%,
    25% 93.3%,
    28.79% 71.21%,
    6.7% 75%,
    21.02% 57.76%,
    0% 50%,
    21.02% 42.24%,
    6.7% 25%,
    28.79% 28.79%,
    25% 6.7%,
    42.24% 21.02%,
    50% 0%,
    57.76% 21.02%,
    75% 6.7%,
    71.21% 28.79%,
    93.3% 25%,
    78.98% 42.24%
  );
  z-index: 2;
}

/* Изображение */
.dish-image {
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

/* Детали блюда */
.dish-details {
  padding: 16px;
}

.dish-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.dish-description {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 16px;
}

/* Цена */
.dish-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: orangered;
  margin: 16px 0;
}

/* Кнопка */
.add-to-cart-button {
  font-weight: bold;
  background-color: rgb(117, 109, 33);
}
</style>
