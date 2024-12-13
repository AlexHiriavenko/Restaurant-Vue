<template>
  <v-app-bar class="app-header" color="black" prominent>
    <v-toolbar-title v-if="$vuetify.display.mdAndUp" class="pt-2">
      <v-btn to="/" height="110px" color="black">
        <v-img
          src="https://edok.com.ua/img/logo1.png"
          alt="Лого"
          max-height="50"
          height="87px"
          width="108px"
        ></v-img>
      </v-btn>
    </v-toolbar-title>

    <NavBar
      v-if="$vuetify.display.mdAndUp"
      :tabs="filteredRoutes"
      @authRequired="authItemClick({ action: 'login' })"
    />

    <DropMenu
      v-if="$vuetify.display.smAndDown"
      :items="filteredRoutes"
      @itemClick="navItemClick"
    />

    <v-spacer></v-spacer>
    <v-badge
      :content="orderStore.currentOrder.length"
      color="primary"
      offset-x="10"
      offset-y="10"
      class="mx-2"
    >
      <v-btn icon="mdi-cart" variant="text" :to="'/cart'"></v-btn>
    </v-badge>
    <DropMenu :items="authItems" @itemClick="authItemClick">
      <template #menuActivator="{ props }">
        <v-avatar
          v-if="userStore.currentUser?.avatar"
          v-bind="props"
          :image="userStore.currentUser?.avatar"
          size="36"
          color="white"
          class="cursor-pointer"
        ></v-avatar>
        <v-btn v-else icon="mdi-account" variant="text" v-bind="props"></v-btn>
        <span style="padding-inline: 8px">{{
          userStore.currentUser?.name || ''
        }}</span>
      </template>
    </DropMenu>
  </v-app-bar>

  <ModalDialog ref="modalRef">
    <template #modal-content>
      <LoaderSpinner :isLoading="isLoading" />
      <AuthResultMessage
        v-if="userStore.authResultMessage && !isLoading"
        :closeModal="closeModal"
      />
      <AuthForm
        v-else
        v-show="!isLoading && !userStore.isLoggedIn"
        :currentSubmitMethod="currentSubmitMethod"
        :form-title="formTitle"
        :authType="authType"
        @update:authType="handleAuthTypeChange"
        v-model:isLoading="isLoading"
      />
    </template>
  </ModalDialog>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import NavBar from '@/components/general/NavBar.vue';
import DropMenu from '@/components/general/DropMenu.vue';
import AuthForm from '@/components/auth/AuthForm.vue';
import LoaderSpinner from '@/components/general/LoaderSpinner.vue';
import AuthResultMessage from '@/components/auth/AuthResultMessage.vue';
import { useOrderStore } from '@/stores/orderStore';

const userStore = useUserStore();
const orderStore = useOrderStore();
const router = useRouter();

const filteredRoutes = computed(() => {
  return router.options.routes
    .filter(
      (route) =>
        route.meta?.showInTabs ||
        (route.meta?.requiresAdmin && userStore.currentUser?.role === 'admin')
    )
    .map((route) => ({
      ...route,
      text: route.meta?.title
    }));
});

const navItemClick = (item) => router.push({ name: item.name });

const authItems = computed(() => {
  return userStore.isLoggedIn
    ? [{ text: 'Logout', action: 'logout' }]
    : [
        { text: 'Login', action: 'login' },
        { text: 'SignUp', action: 'signup' }
      ];
});

const currentSubmitMethod = ref(null);
const formTitle = ref('');
const isLoading = ref(false);
const authType = ref('');
const modalRef = ref(null);

const closeModal = () => modalRef.value?.closeModal();

const authItemClick = (item) => {
  authType.value = item.action;

  if (item.action === 'login') {
    currentSubmitMethod.value = userStore.login;
    formTitle.value = 'LogIn Form';
    modalRef.value.openModal();
  }

  if (item.action === 'signup') {
    currentSubmitMethod.value = userStore.signup;
    formTitle.value = 'SignUp Form';
    modalRef.value.openModal();
  }

  if (item.action === 'logout') {
    userStore.logout();
  }

  userStore.setAuthResult('');
};

const handleAuthTypeChange = (newAuthType) => {
  authType.value = newAuthType;

  if (newAuthType === 'login') {
    currentSubmitMethod.value = userStore.login;
    formTitle.value = 'LogIn Form';
  } else {
    currentSubmitMethod.value = userStore.signup;
    formTitle.value = 'SignUp Form';
  }
};
</script>
