<template>
  <v-card class="category-card" elevation="2">
    <router-link :to="`/menu/${category.slug}/`" class="image-container">
      <img :src="category.image" :alt="category.name" class="category-image" />
      <!-- Затемнение -->
      <div class="overlay"></div>
      <div class="category-name text-shadow">
        {{ category.name }}
      </div>
    </router-link>
  </v-card>
</template>

<script setup>
// Пропс для передачи данных карточки
const props = defineProps({
  category: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      image: '',
      name: '',
      slug: ''
    })
  }
});
</script>
