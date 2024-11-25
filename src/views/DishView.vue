<template>
  <v-container class="dish-view" fluid>
    <v-row class="dish-row" align="center" justify="center">
      <!-- Изображение блюда -->
      <v-col cols="12" md="6" class="dish-image-container">
        <v-img :src="dish.img" :alt="dish.name" class="dish-image" />
      </v-col>

      <!-- Детали блюда -->
      <v-col cols="12" md="6" class="dish-details">
        <!-- Название блюда -->
        <h1 class="dish-title">{{ dish.name }}</h1>

        <!-- Цена и кнопка -->
        <div class="price-and-button">
          <p class="dish-price">{{ dish.final_price }} грн</p>
          <v-btn class="add-to-cart-button" color="yellow darken-1">
            Додати до кошика
          </v-btn>
        </div>

        <!-- Описание -->
        <p class="dish-description">{{ dish.description }}</p>

        <!-- Вес -->
        <p class="dish-weight">Вага: {{ dish.weight }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute();
const dish = ref({
  id: null,
  name: '',
  description: '',
  final_price: 0,
  img: '',
  weight: ''
});

// Эмулируем загрузку данных блюда (можно заменить на запрос к API)
onMounted(() => {
  // Здесь вы можете сделать запрос к API, например:
  // const response = await fetch(`/api/dishes/${route.params.dishId}`);
  // dish.value = await response.json();

  // Временные данные для примера
  dish.value = {
    id: 1,
    name: 'Сирний крем-суп',
    description:
      'Картопля, бульйон, вершкове масло, вершки, сир плавлений, крутони, бекон',
    final_price: 190,
    img: 'https://via.placeholder.com/600x400', // Замените на реальное изображение
    weight: '350г'
  };
});
</script>

<style scoped>
/* Основной контейнер */
.dish-view {
  margin-top: 32px;
}

/* Ряд с блюдом */
.dish-row {
  max-width: 1200px;
  margin: 0 auto;
}

/* Контейнер для изображения */
.dish-image-container {
  text-align: center;
}

/* Изображение блюда */
.dish-image {
  border-radius: 8px;
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

/* Детали блюда */
.dish-details {
  text-align: left;
  padding: 16px;
}

/* Название блюда */
.dish-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 16px;
}

/* Цена */
.dish-price {
  font-size: 2rem;
  font-weight: bold;
  color: red;
  margin-bottom: 16px;
}

/* Кнопка */
.add-to-cart-button {
  font-weight: bold;
  color: white;
  margin-bottom: 16px;
}

/* Описание */
.dish-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
}

/* Вес */
.dish-weight {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}
</style>
