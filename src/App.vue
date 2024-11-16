<template>
  <v-layout>
    <HeaderApp />
    <v-main>
      <LoaderSpinner
        :is-loading="!contentStore.content"
        :color="'white'"
        :size="70"
      />
      <RouterView v-if="contentStore.content" />
    </v-main>
  </v-layout>
</template>

<script setup>
import HeaderApp from '@/components/HeaderApp.vue';
import { useContentStore } from './stores/contentStore';

const contentStore = useContentStore();
contentStore.getContent();
</script>
