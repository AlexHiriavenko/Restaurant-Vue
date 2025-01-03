<template>
  <v-container fluid class="views">
    <h2 class="text-h3 text-white text-center py-6 page-title">
      Історія Замовлень
    </h2>
    <LoaderSpinner
      :isLoading="isLoading"
      :isFixed="true"
      :size="70"
      color="white"
    />
    <h2
      v-if="!paginatedItems.length && !isLoading"
      class="text-h5 text-white text-center mb-4"
    >
      У вас поки ще не було замовлень
    </h2>
    <div
      v-if="!isLoading"
      style="max-width: 1200px; min-height: 660px"
      class="mx-auto"
    >
      <v-row
        v-for="(order, index) in paginatedItems"
        :key="order.id"
        class="mb-6"
      >
        <!-- Заголовок заказа -->
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <div class="d-flex justify-space-between align-center w-100">
                <div>
                  Замовлення № {{ orderStore.userOrders.length - index }}
                </div>
                <v-btn @click="toggleDetails(order.id)" text width="180">
                  {{
                    openOrderId === order.id
                      ? 'Сховати деталі'
                      : 'Показати деталі'
                  }}
                </v-btn>
              </div>
            </v-card-title>
            <v-card-subtitle>
              <div class="d-flex justify-space-between">
                <span class="mb-4">ID Замовлення: {{ order.id }}</span>
                <span>Дата: {{ formatDate(order.created_at) }}</span>
                <span :class="STATUS_COLORS[order.status]"
                  >Статус: {{ STATUS[order.status] }}</span
                >
                <span
                  >Тип:
                  {{ order.type === 'pickup' ? 'Самовіз' : 'Доставка' }}</span
                >
                <span>Адреса: {{ order.address || 'Не вказано' }}</span>
              </div>
            </v-card-subtitle>

            <!-- Детали заказа -->
            <v-expand-transition>
              <div
                v-if="openOrderId === order.id"
                class="mt-4 position-relative"
              >
                <v-card-title class="mb-4 text-success">
                  Деталі Замовлення
                </v-card-title>
                <v-table class="pr-4">
                  <thead>
                    <tr>
                      <th>Страва</th>
                      <th>Ціна</th>
                      <th>Кількість</th>
                      <th>Добавки</th>
                      <th>Вартість</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items" :key="item.id">
                      <td>{{ item.name }}</td>
                      <td>{{ item.price }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>
                        <div v-if="item.modifiers.length > 0">
                          <div
                            v-for="modifier in item.modifiers"
                            :key="modifier.id"
                          >
                            {{ modifier.name }}: {{ modifier.price }}
                          </div>
                        </div>
                        <div v-else>Без добавок</div>
                      </td>
                      <td>{{ item.total_price }}</td>
                    </tr>
                  </tbody>
                </v-table>
                <v-card-title class="mt-6 text-decoration-underline">
                  Загальна Вартість Замовлення:
                  <span class="font-weight-bold text-success ml-4">{{
                    order.total_price
                  }}</span>
                </v-card-title>
                <div
                  v-if="order.status === 'done'"
                  class="position-absolute stamp-image-wrapper"
                >
                  <v-img
                    :src="stamp"
                    :width="140"
                    :height="140"
                    class="mx-auto"
                    cover
                    position="left"
                  ></v-img>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <PaginationBar
      v-if="orderStore.userOrders.length > PER_PAGE"
      v-model="page"
      :length="totalPages"
      :total-visible="5"
      @update:model-value="handlePageChange"
    />
  </v-container>
</template>

<script setup>
import { useOrderStore } from '@/stores/orderStore';
import PaginationBar from '@/components/general/PaginationBar.vue';
import { usePagination } from '@/composables/usePagination';
import stamp from '@/assets/imgs/stamp.png';

const orderStore = useOrderStore();
const isLoading = ref(false);
const openOrderId = ref(null);
const PER_PAGE = 5;

const STATUS_COLORS = {
  in_progress: 'text-blue',
  rejected: 'text-red',
  done: 'text-green'
};

const STATUS = {
  in_progress: 'готується',
  rejected: 'відхилено',
  done: 'виконано'
};

const toggleDetails = (orderId) => {
  openOrderId.value = openOrderId.value === orderId ? null : orderId;
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('uk-UA', options);
};

onMounted(async () => {
  if (!orderStore.userOrders.length) {
    isLoading.value = true;
    try {
      await orderStore.getUserOrders();
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
});

const { page, paginatedItems, totalPages, handlePageChange } = usePagination(
  computed(() => orderStore.userOrders),
  PER_PAGE
);
</script>

<style>
.stamp-image-wrapper {
  bottom: 10px;
  right: 0;
}
</style>
