import axios from '@/axios/axios';

export const useOrderStore = defineStore('orderStore', () => {
  // Загружаем данные из localStorage при инициализации
  const savedOrder = localStorage.getItem('currentOrder');
  const currentOrder = ref(savedOrder ? JSON.parse(savedOrder) : []);
  const userOrders = ref([]);

  function addToOrder(dish) {
    currentOrder.value.push(dish);
  }

  const updateCurrentOrder = (index, updatedDish) => {
    currentOrder.value[index] = updatedDish;
  };

  const resetOrder = () => (currentOrder.value = []);

  async function createOrder(data) {
    try {
      const order = await axios.post('/orders/store', data);
      console.log(order);
    } catch (error) {
      throw error;
    }
  }

  async function getUserOrders(id) {
    const url = id ? `/orders/user/${id}` : '/orders/user';

    const orders = await axios.get(url);

    if (Array.isArray(orders) && orders.length) {
      userOrders.value = orders;
    } else {
      userOrders.value = [];
    }
  }

  function resetUserOrders() {
    userOrders.value = [];
  }

  // Вотчер для синхронизации currentOrder с localStorage
  watch(
    currentOrder,
    (newOrder) => {
      localStorage.setItem('currentOrder', JSON.stringify(newOrder));
    },
    { deep: true }
  );

  return {
    currentOrder,
    userOrders,
    addToOrder,
    updateCurrentOrder,
    resetOrder,
    createOrder,
    getUserOrders,
    resetUserOrders
  };
});
