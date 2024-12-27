<template>
  <v-menu>
    <template #activator="{ props }">
      <v-badge
        :content="unreadCount"
        :color="unreadCount > 0 ? 'error' : 'success'"
        offset-x="10"
        offset-y="10"
        class="mx-2"
      >
        <v-btn icon="mdi-bell" variant="text" v-bind="props"></v-btn>
      </v-badge>
    </template>
    <v-list class="notify-list" style="height: 180px; width: 200px">
      <v-list-item-title
        v-if="!notifyStore.notifications.length"
        class="pa-6 empty"
        >Нових повідомлень немає</v-list-item-title
      >
      <v-list-item
        v-for="(notification, index) in notifyStore.notifications"
        :key="notification.id || index"
        class="notify-item"
      >
        <v-list-item-title
          class="cursor-pointer"
          :class="{
            'font-weight-bold': !notification.was_read,
            'font-weight-regular': notification.was_read,
            'text-ellipsis': true
          }"
        >
          {{ notification.text || notification.name }}
        </v-list-item-title>
        <v-btn
          icon="mdi-delete"
          variant="text"
          size="small"
          @click="onDeleteClick"
        ></v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { useNotifyStore } from '@/stores/notificationStore';
import { computed, ref } from 'vue';

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const notifyStore = useNotifyStore();

const unreadCount = ref(0);

function onDeleteClick() {
  console.log('delete');
}

watch(
  () => notifyStore.notifications,
  (newVal, oldVal) => {
    unreadCount.value = newVal.filter((n) => !n.was_read).length;
  },
  {
    // deep: true,
    immediate: true // Выполнить при первой инициализации
  }
);
</script>

<style>
.notify-item .v-list-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notify-list .empty {
  white-space: normal;
  overflow: visible;
  word-wrap: break-word;
  text-align: center;
}
</style>
<!-- @click="itemClick(notification)" -->
