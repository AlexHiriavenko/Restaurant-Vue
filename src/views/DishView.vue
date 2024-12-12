<template>
  <LoaderSpinner
    :isLoading="isLoading"
    :isFixed="true"
    :size="70"
    color="white"
  />
  <v-container
    v-if="!isLoading && dishesStore.currentDish"
    class="dish-view pt-12"
    fluid
  >
    <v-row class="dish-row mx-auto" align="center" justify="center">
      <!-- Изображение блюда -->
      <img
        v-if="dishesStore.currentDish"
        :src="dishesStore.currentDish.img"
        :alt="dishesStore.currentDish.name"
        class="dish-img"
      />

      <!-- Детали блюда -->
      <v-col
        cols="12"
        md="6"
        class="dish-details d-flex flex-column align-center justify-center ga-6"
      >
        <!-- Название блюда -->
        <h1 class="dish-title text-center text-h3 text-white">
          {{ dishesStore.currentDish?.name }}
        </h1>

        <!-- Цена -->
        <p class="dish-price text-center py-2">
          {{ dishesStore.currentDish?.final_price }} грн
        </p>

        <!-- Описание -->
        <v-card-text
          class="dish-description text-subtitle-1 text-white text-center"
        >
          {{ dishesStore.currentDish?.description }}
        </v-card-text>

        <!-- Количество -->
        <v-row align="center" justify="center" class="quantity-controls py-2">
          <v-btn
            @click="decrementQuantity"
            color="red lighten-1"
            class="qty-btn"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <span class="qty-display">{{ quantity }}</span>
          <v-btn
            @click="incrementQuantity"
            color="green lighten-1"
            class="qty-btn"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <!-- Секция модификаторов -->
    <h3 class="text-center text-h5 text-white py-4 mt-4">Добавки:</h3>
    <v-row class="modifiers-container mx-auto" style="max-width: 960px">
      <v-col
        v-for="modifier in dishesStore.currentDish?.modifiers"
        :key="modifier.id"
        cols="12"
        sm="6"
        md="4"
        class="modifier-item justify-center"
      >
        <v-checkbox
          density="compact"
          hide-details="true"
          v-model="selectedModifiers"
          :value="modifier"
          :label="`${modifier.name} (+${modifier.price} грн)`"
          class="modifier-checkbox"
        />
      </v-col>
    </v-row>

    <!-- Итоговая стоимость -->
    <h2 class="text-center text-h4 text-white py-4 mt-4">
      Загальна вартість: {{ totalPrice.toFixed(2) }} грн
    </h2>

    <!-- Добавление в корзину -->
    <v-card-actions class="d-flex justify-center">
      <v-btn class="details-button" color="yellow darken-3" @click="addToCart">
        Додати до кошика
      </v-btn>
    </v-card-actions>
  </v-container>
  <ModalDialog ref="modalRef">
    <template #modal-content>
      <v-container class="d-flex flex-column align-center justify-center">
        <v-card-title class="text-h5">До Кошика додано:</v-card-title>
        <v-spacer></v-spacer>
        <v-card-text class="text-subtitle-1">
          Страва:{{ dishesStore.currentDish.name }}, у кількості: {{ quantity }}
        </v-card-text>
        <v-card-text v-if="selectedModifiers.length" class="text-subtitle-1">
          з добавками:{{ modifiersStringList }}
        </v-card-text>
        <v-container class="d-flex align-center justify-center ga-2">
          <router-link :to="`/`" custom v-slot="{ href }">
            <a @click.prevent="comeBack" :href="href" class="modal-link">
              Замовити ще
            </a>
          </router-link>
          <router-link :to="`/menu`" class="modal-link">до Меню</router-link>
          <router-link :to="`/cart`" class="modal-link">до Кошика</router-link>
        </v-container>
      </v-container>
    </template>
  </ModalDialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDishesStore } from '@/stores/dishesStore';
import { useOrderStore } from '@/stores/orderStore';

const dishesStore = useDishesStore();
const orderStore = useOrderStore();

const route = useRoute();
const dishSlug = computed(() => route.params.dishSlug);

const isLoading = ref(false);
const quantity = ref(1);
const selectedModifiers = ref([]);

const modalRef = ref(null);

// Загрузка текущего блюда
onMounted(async () => {
  isLoading.value = true;
  await dishesStore.getDishBySlug(dishSlug.value);
  isLoading.value = false;
});

// Очистка состояния при демонтировании
onUnmounted(() => {
  dishesStore.resetDish();
});

// Увеличение и уменьшение количества
const incrementQuantity = () => {
  quantity.value += 1;
};

const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value -= 1;
};

// Расчёт стоимости блюда + модификаторов

const totalPerUnit = computed(() => {
  const basePrice = +dishesStore.currentDish?.final_price;
  const modifiersPrice = selectedModifiers.value.reduce(
    (sum, modifier) => sum + parseFloat(modifier.price),
    0
  );
  return basePrice + modifiersPrice;
});

// Расчёт общей стоимости

const totalPrice = computed(() => totalPerUnit.value * quantity.value);

const modifiersStringList = computed(() => {
  return selectedModifiers.value.reduce((acc, modifier) => {
    acc += modifier.name + ', ';
    return acc;
  }, '');
});

function resetDishParams() {
  selectedModifiers.value = [];
  quantity.value = 1;
}

function comeBack() {
  resetDishParams();
  modalRef.value.closeModal();
}

// Добавление в корзину
const addToCart = () => {
  const dishWithModifiers = {
    id: dishesStore.currentDish.id,
    name: dishesStore.currentDish.name,
    quantity: quantity.value,
    price: dishesStore.currentDish.final_price,
    modifiers: [...selectedModifiers.value],
    total: totalPrice.value,
    price: +dishesStore.currentDish?.final_price,
    totalPerUnit: totalPerUnit.value
  };

  orderStore.addToOrder(dishWithModifiers);
  modalRef.value.openModal();
};
</script>
