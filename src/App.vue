<template>
  <v-layout>
    <HeaderApp />
    <v-main>
      <LoaderSpinner :is-loading="false" :color="'white'" :size="70" />
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup>
import HeaderApp from '@/components/HeaderApp.vue';
import { useDishesStore } from '@/stores/dishesStore';
import { useUserStore } from './stores/userStore';

const dishesStore = useDishesStore();
const userStore = useUserStore();

onMounted(async () => {
  if (!dishesStore.dishesCategories.length) {
    await dishesStore.getDishesCategories();
  }

  await userStore.getUser();
});
</script>
