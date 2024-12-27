<template>
  <v-menu :close-on-content-click="false" v-model="menu">
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
        v-for="(notification, index) in notifyList"
        :key="notification.id || index"
        class="notify-item"
      >
        <v-list-item-title
          @click="notifyClick(notification.id, notification.text)"
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
          @click="notifyStore.deleteNotification(notification.id)"
        ></v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
  <ModalDialog ref="modalRef">
    <template #modal-content>
      <v-container
        class="d-flex flex-column align-center justify-center pt-0 mb-4"
      >
        <v-card-title class="text-h5 py-0">Повідомлення:</v-card-title>
        <v-spacer></v-spacer>
        <v-card-text class="text-subtitle-1">
          {{ currentNotifyText }}
        </v-card-text>
        <v-spacer></v-spacer>
        <v-btn
          text="OK"
          color="success"
          @click="modalRef.closeModal()"
          v-focus
        ></v-btn>
      </v-container>
    </template>
  </ModalDialog>
</template>

<script setup>
import { useNotifyStore } from '@/stores/notificationStore';

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const notifyStore = useNotifyStore();

const unreadCount = ref(0);
const modalRef = ref(null);
const menu = ref(false);
const currentNotifyText = ref('');
const notifyList = ref([]);

function notifyClick(id, text) {
  modalRef.value.openModal();
  menu.value = false;
  currentNotifyText.value = text;
  notifyStore.markAsRead(id);
}

watch(
  () => notifyStore.notifications,
  (newVal, oldVal) => {
    unreadCount.value = newVal.filter((n) => !n.was_read).length;
    notifyList.value = newVal;
  },
  {
    deep: true,
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
