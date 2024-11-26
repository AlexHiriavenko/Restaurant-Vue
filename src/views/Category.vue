<template>
  <div>
    <h1 class="text-h3 text-white text-center py-4 page-title">
      {{ dishesStore.currentCategory?.name }}
    </h1>
    <LoaderSpinner
      :isLoading="isLoading"
      :isFixed="true"
      :size="70"
      color="white"
    />
    <v-row
      v-if="!isLoading"
      style="max-width: 1200px; min-height: 500px"
      class="mx-auto justify-start"
    >
      <v-col
        v-for="dish in dishesStore.dishes"
        :key="dish.id"
        cols="12"
        sm="6"
        md="4"
        class="justify-center"
      >
        <DishCard :dish="dish" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useDishesStore } from '@/stores/dishesStore';
import DishCard from '@/components/dishes/DishCard.vue';

const dishesStore = useDishesStore();
const route = useRoute();
const slug = computed(() => route.params.categorySlug);
const isLoading = ref(false);

onMounted(async () => {
  if (!dishesStore.dishesCategories.length) {
    isLoading.value = true;
    await dishesStore.getDishesCategories();
  }

  if (!dishesStore.currentCategory) {
    const category = dishesStore.findCategoryBySlug(slug.value) || null;
    dishesStore.setCategory(category);
  }

  const id = dishesStore.currentCategory?.id || null;
  isLoading.value = true;
  await dishesStore.getDishesByCategory(id);
  isLoading.value = false;
});

onUnmounted(() => {
  dishesStore.resetDishes();
});
</script>
