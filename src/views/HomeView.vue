<template>
  <div class="home-img-container">
    <v-img
      :src="prmImage"
      :width="1100"
      :height="300"
      class="mx-auto"
      cover
      position="left"
    ></v-img>
  </div>
  <v-container
    fluid
    class="home-container d-flex justify-center ga-8 px-0 py-4"
  >
    <SideBar v-if="$vuetify.display.mdAndUp" />
    <DishesMenu />
  </v-container>
</template>

<script setup>
import prmImage from '@/assets/imgs/prm.jpg';
import SideBar from '@/components/SideBar.vue';
import DishesMenu from '@/components/dishes/DishesMenu.vue';
</script>
