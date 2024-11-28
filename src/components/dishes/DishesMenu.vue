<template>
  <div class="main-content">
    <h2 class="dish-title text-center text-h3 text-white mb-4">Меню</h2>
    <!-- Строка поиска -->
    <v-row class="search-row" align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-text-field
          :loading="isLoading"
          append-inner-icon="mdi-magnify"
          color="black"
          base-color="white"
          bg-color="white"
          v-model="searchParam"
          label="пошук блюд"
          variant="solo"
          density="comfortable"
          clearable
          class="search-field mx-auto"
          max-width="86%"
          @click:append-inner="searchDishes"
          @keydown.enter="searchDishes"
        ></v-text-field>
      </v-col>
    </v-row>

    <LoaderSpinner
      :isLoading="isLoading"
      :isFixed="false"
      :size="70"
      color="white"
    />

    <!-- Сетка карточек -->
    <div class="dish-cards-container" v-show="!isLoading">
      <v-row class="px-4 justify-center gy-2" dense>
        <v-col
          v-for="dish in dishesStore.dishes"
          :key="dish.id"
          cols="12"
          sm="6"
          class="d-flex justify-center"
          style="max-width: 330px"
        >
          <DishCard :dish="dish" />
        </v-col>
      </v-row>
      <v-progress-linear
        v-if="isFetching && dishesStore.dishesUrl.next"
        color="white"
        indeterminate
        class="mt-4"
      ></v-progress-linear>
      <!-- Триггер для загрузки новых данных -->
      <div ref="loadTrigger" class="load-trigger"></div>
    </div>
  </div>
</template>

<script setup>
import DishCard from '@/components/dishes/DishCard.vue';
import { useDishesStore } from '@/stores/dishesStore';

const dishesStore = useDishesStore();
const loadTrigger = ref(null);
let isFetching = false;
const isLoading = ref(false);
const searchParam = ref(''); // Параметр поиска
const PER_PAGE = 4;

// Метод для загрузки новых данных
const loadMoreDishes = async () => {
  if (isFetching) return;

  if (dishesStore.dishesUrl.next) {
    isFetching = true;
    await dishesStore.fetchDishes({
      cursor: dishesStore.dishesUrl.next,
      searchParam: searchParam.value
    });
    isFetching = false;
  }
};

// Метод для поиска
const searchDishes = async () => {
  isLoading.value = true;
  dishesStore.resetDishes();
  await dishesStore.fetchDishes({
    searchParam: searchParam.value,
    perPage: PER_PAGE
  });
  isLoading.value = false;
};

onMounted(async () => {
  isLoading.value = true;
  dishesStore.resetDishes();
  await dishesStore.fetchDishes({ perPage: PER_PAGE });
  isLoading.value = false;

  // Настраиваем IntersectionObserver
  const observer = new IntersectionObserver(
    async (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && dishesStore.dishesUrl.next) {
        await loadMoreDishes();
      }
    },
    {
      root: document.querySelector('.dish-cards-container'),
      rootMargin: '0px',
      threshold: 0.1
    }
  );

  if (loadTrigger.value) {
    observer.observe(loadTrigger.value);
  }
});
</script>
