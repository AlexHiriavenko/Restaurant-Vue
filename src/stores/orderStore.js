export const useOrderStore = defineStore('orderStore', () => {
  const currentOrder = ref([]);
  const ordersHistory = ref([]);

  function addToOrder(dish) {
    currentOrder.value.push(dish);
  }

  const updateCurrentOrder = (index, updatedDish) => {
    currentOrder.value[index] = updatedDish;
  };

  const resetOrder = () => (currentOrder.value = []);

  return {
    currentOrder,
    addToOrder,
    updateCurrentOrder,
    resetOrder
  };
});
