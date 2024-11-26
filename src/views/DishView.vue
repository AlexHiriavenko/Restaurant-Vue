<template>
  <LoaderSpinner
    :isLoading="isLoading"
    :isFixed="true"
    :size="70"
    color="white"
  />
  <v-container v-if="!isLoading" class="dish-view pt-12" fluid>
    <v-row class="dish-row mx-auto" align="center" justify="center">
      <!-- Изображение блюда -->
      <v-col cols="12" md="6" class="dish-image-container">
        <v-img
          :src="dishesStore.currentDish?.img"
          :alt="dishesStore.currentDish?.name"
          class="dish-img"
        />
      </v-col>

      <!-- Детали блюда -->
      <v-col
        cols="12"
        md="6"
        class="dish-details d-flex flex-column align-center justify-center ga-6"
      >
        <!-- Название блюда -->
        <h1 class="dish-title text-center text-h3 text-white">
          {{ dishesStore.currentDish?.name }}
        </h1>

        <!-- Цена и кнопка -->

        <p class="dish-price text-center py-2">
          {{ dishesStore.currentDish?.final_price }} грн
        </p>

        <!-- Описание -->
        <v-card-text
          class="dish-description text-subtitle-1 text-white text-center"
        >
          {{ dishesStore.currentDish?.description }}
        </v-card-text>
      </v-col>
    </v-row>
    <h3 class="text-center text-h5 text-white py-4 mt-4">Добавки:</h3>
    <v-checkbox label="Сіль" value="сіль"></v-checkbox>
    <v-checkbox label="Перець" value="перець"></v-checkbox>
    <h2 class="text-center text-h4 text-white py-4 mt-4">
      Загальна вартість страви:
    </h2>
    <v-card-actions>
      <v-btn class="details-button" color="yellow darken-3">
        Додати до кошика
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script setup>
import { useDishesStore } from '@/stores/dishesStore';

const dishesStore = useDishesStore();

const route = useRoute();
const dishSlug = computed(() => route.params.dishSlug);

const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  await dishesStore.getDishBySlug(dishSlug.value);
  isLoading.value = false;
});

onUnmounted(() => {
  dishesStore.resetDish();
});
</script>

<style scoped>
/* Основной контейнер */
.add-to-cart-button {
  width: 200px;
}

.dish-view {
  max-width: 1200px;
}

.dish-row {
  width: 100%;
}

.dish-img {
  max-width: 460px;
  margin-inline: auto;
}
</style>
