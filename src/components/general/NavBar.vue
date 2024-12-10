<template>
  <v-tabs v-model="activeTab" align-tabs="center">
    <v-tab
      v-for="route in tabs"
      :key="route.name"
      :value="route.name"
      class="text-white"
      @click="onTabClick(route)"
    >
      {{ route.meta?.title || route.name }}
    </v-tab>
  </v-tabs>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['authRequired']);
const router = useRouter();
const activeTab = ref(null);
const userStore = useUserStore();

watch(
  () => router.currentRoute.value.name,
  (newRouteName) => {
    activeTab.value = newRouteName;
  }
);

// Обработка клика по вкладке
function onTabClick(route) {
  if (route.name) {
    if (route.meta.requiresAuth && !userStore.isLoggedIn) {
      activeTab.value = router.currentRoute.value.name;
      // вызов модалки в хедере с authItemClick({ action: 'login' });
      emit('authRequired');
    }
    router.push({ name: route.name });
  } else {
    activeTab.value = null;
  }
}
</script>
