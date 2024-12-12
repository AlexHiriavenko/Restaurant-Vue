<template>
  <v-container v-if="!isLoading" class="cart-view pt-12" fluid>
    <h1 class="text-h4 text-white text-center mb-6">Корзина</h1>

    <!-- Список блюд в корзине -->
    <v-row
      v-if="orderStore.currentOrder.length > 0"
      class="mx-auto justify-center"
      style="max-width: 1360px"
    >
      <v-col
        v-for="(dish, index) in orderStore.currentOrder"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <OrderCard :dish="dish" :index="index" />
      </v-col>
    </v-row>

    <!-- Пустая корзина -->
    <p v-else class="text-center text-white text-h6">Кошик поки що пустий</p>

    <!-- Итоговая стоимость -->
    <h2
      v-if="orderStore.currentOrder.length > 0"
      class="text-center text-h4 text-white mt-6"
    >
      Вартість Замовлення:
      <span class="text-orange-darken-3">
        {{ totalOrderPrice.toFixed(2) }} грн
      </span>
    </h2>

    <!-- Форма с информацией о заказе -->
    <v-row
      v-if="orderStore.currentOrder.length > 0"
      class="mt-6 mx-auto justify-center"
      style="max-width: 700px"
    >
      <v-radio-group
        inline
        color="green"
        v-model="deliveryType"
        direction="horizontal"
      >
        <v-radio value="pickup" base-color="white">
          <template v-slot:label>
            <span class="text-white">Самовивіз</span>
          </template>
        </v-radio>

        <v-radio value="delivery" base-color="white">
          <template v-slot:label>
            <span class="text-white">Доставка</span>
          </template>
        </v-radio>
      </v-radio-group>

      <v-col cols="12">
        <v-text-field
          prepend-inner-icon="mdi-cellphone"
          v-model="phoneNumber"
          label="Телефон"
          type="tel"
          color="black"
          base-color="white"
          bg-color="white"
          :rules="[
            (value) => /^\d*$/.test(value) || 'Можно вводить только цифры'
          ]"
          required
          max-width="460"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          prepend-inner-icon="mdi-map-marker"
          v-model="deliveryAddress"
          label="Адреса доставки"
          color="black"
          base-color="white"
          bg-color="white"
          :disabled="deliveryType === 'pickup'"
          clearable
          max-width="460"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Кнопка отправки заказа -->
    <v-card-actions class="d-flex justify-center mt-6">
      <v-btn
        color="yellow darken-3"
        class="submit-order-button details-button"
        :disabled="orderStore.currentOrder.length === 0 || !isFormValid"
        @click="submitOrder"
      >
        Підтвердити Замовлення
      </v-btn>
    </v-card-actions>
  </v-container>
  <LoaderSpinner
    :isLoading="isLoading"
    :isFixed="true"
    :size="70"
    color="white"
  />
  <ModalDialog ref="modalRef">
    <template #modal-content>
      <v-container class="d-flex flex-column align-center justify-center">
        <v-card-title class="text-h5">{{ resultMessage }}</v-card-title>
        <v-btn
          text="OK"
          :color="buttonColor"
          @click="modalRef.closeModal()"
          v-focus
        ></v-btn>
      </v-container>
    </template>
  </ModalDialog>
</template>

<script setup>
import { useOrderStore } from '@/stores/orderStore';
import OrderCard from '@/components/dishes/OrderCard.vue';

const orderStore = useOrderStore();
const phoneNumber = ref('');
const deliveryAddress = ref(null);
const deliveryType = ref('pickup');
const resultMessage = ref('');
const modalRef = ref(null);
const isLoading = ref(false);
const buttonColor = ref('success');
// const buttonColor = computed(() => (userStore.isLoggedIn ? 'success' : 'error'))

// Итоговая стоимость заказа
const totalOrderPrice = computed(() =>
  orderStore.currentOrder.reduce((sum, dish) => sum + dish.total, 0)
);

// Очистка адреса при переключении на самовывоз
watch(deliveryType, (newValue) => {
  if (newValue === 'pickup') {
    deliveryAddress.value = '';
  }
});

// Проверка валидности формы
const isFormValid = computed(() => {
  if (deliveryType.value === 'delivery') {
    return phoneNumber.value.trim() && deliveryAddress.value.trim();
  }
  return phoneNumber.value.trim();
});

// Отправка заказа
const submitOrder = async () => {
  const order = {
    dishes: orderStore.currentOrder,
    total: totalOrderPrice.value,
    phone: phoneNumber.value,
    deliveryType: deliveryType.value,
    address: deliveryType.value === 'delivery' ? deliveryAddress.value : null
  };

  console.log(order);

  isLoading.value = true;
  try {
    await orderStore.createOrder(order);
    orderStore.resetOrder();
    phoneNumber.value = '';
    deliveryAddress.value = '';
    deliveryType.value = 'pickup';
    resultMessage.value = 'Ваше замовлення прийнято';
    buttonColor.value = 'success';
  } catch (error) {
    resultMessage.value = error.response.data?.message || error.message;
    buttonColor.value = 'error';
    console.log(error);
  } finally {
    isLoading.value = false;
    modalRef.value.openModal();
  }
};
</script>

<style></style>
