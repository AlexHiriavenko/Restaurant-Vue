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
</script>
