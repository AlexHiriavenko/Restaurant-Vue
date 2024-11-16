<template>
  <v-container fluid class="views home">
    <h2 class="text-h3 text-white text-center py-12 page-title">
      {{ title }}
    </h2>
    <p>{{ testMessage }}</p>
  </v-container>
</template>

<script setup>
import axios from '@/axios/axios.js';
const testMessage = ref('Default Message');

const title = ref('Mane Page');

onMounted(async () => {
  const data = await axios.get('test');
  testMessage.value = data.message;
});
</script>
