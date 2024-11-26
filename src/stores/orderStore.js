export const useOrderStore = defineStore('orderStore', () => {
  const currentOrder = ref([]);
  const ordersHistory = ref([]);

  function addToOrder(dish) {
    currentOrder.value.push(dish);
  }

  return {
    currentOrder,
    addToOrder
  };
});
