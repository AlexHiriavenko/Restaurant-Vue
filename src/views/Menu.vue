<template>
  <v-container fluid class="views home">
    <h2 class="text-h3 text-white text-center py-12 page-title">Меню</h2>
    <v-row style="max-width: 1200px; min-height: 500px" class="mx-auto">
      <v-col
        v-for="category in dishesStore.dishesCategories"
        :key="category.id"
        cols="12"
        sm="6"
        md="4"
      >
        <CategoryCard :category="category" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useDishesStore } from '@/stores/dishesStore';
import CategoryCard from '@/components/dishes/CategoryCard.vue';

const dishesStore = useDishesStore();

onMounted(async () => {
  await dishesStore.getDishesCategories();
});
</script>
