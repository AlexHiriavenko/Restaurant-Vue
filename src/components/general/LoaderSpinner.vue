<template>
  <div
    v-if="isLoading"
    :class="['loader-container', { 'fixed-center': isFixed }]"
  >
    <v-container width="100%" class="d-flex justify-center align-center">
      <v-progress-circular :size="size" :color="color" indeterminate />
    </v-container>
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: false
  },
  isFixed: {
    type: Boolean,
    required: false,
    default: false
  },
  size: {
    type: Number,
    required: false,
    default: 50
  },
  color: {
    type: String,
    required: false,
    default: 'primary'
  }
});
</script>

<style scoped>
.fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>
