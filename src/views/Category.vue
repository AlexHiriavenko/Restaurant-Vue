<template>
  <div>
    <h1>{{ categorySlug }}</h1>
    <!-- <ul>
      <li v-for="dish in dishes" :key="dish.slug">
        <router-link :to="`/menu/${categorySlug}/${dish.slug}`">
          {{ dish.name }}
        </router-link>
      </li>
    </ul> -->
  </div>
</template>

<script setup>
const route = useRoute();
const categorySlug = route.params.categorySlug;
</script>
