import axios from '@/axios/axios';

export const useDishesStore = defineStore('dishesStore', () => {
  const dishesCategories = ref([]);

  async function getDishesCategories() {
    dishesCategories.value = await axios.get('categories');
  }

  return {
    dishesCategories,
    getDishesCategories
  };
});
