import axios from '@/axios/axios';
import { ref } from 'vue';

export const useDishesStore = defineStore('dishesStore', () => {
  const dishesCategories = ref([]);
  const currentCategory = ref(null);
  const dishes = ref([]);
  const currentDish = ref(null);
  const dishesUrl = ref({ next: '', prev: '' });

  async function getDishesCategories() {
    try {
      dishesCategories.value = await axios.get('categories');
    } catch (error) {
      dishesCategories.value = [];
    }
  }

  async function getDishesByCategory(id = null) {
    if (!id) {
      dishes.value = [];
      return;
    }
    try {
      dishes.value = await axios.get(`categories/${id}/dishes`);
    } catch (error) {
      dishes.value = [];
    }
  }

  async function getDishesByDiscount() {
    try {
      dishes.value = await axios.get(`dishes/promo`);
    } catch (error) {
      dishes.value = [];
    }
  }

  async function getDishById(id) {
    if (!id) {
      currentDish.value = null;
      return;
    }
    try {
      currentDish.value = await axios.get(`dishes/${id}`);
    } catch (error) {
      currentDish.value = null;
    }
  }

  async function getDishBySlug(slug) {
    if (!slug) {
      currentDish.value = null;
      return;
    }
    try {
      currentDish.value = await axios.get(`dishes/${slug}`);
    } catch (error) {
      currentDish.value = null;
    }
  }

  async function fetchDishes({ searchParam = '', perPage = 4, cursor = null }) {
    try {
      let url = '';

      if (cursor) {
        url = `${cursor}&search=${encodeURIComponent(searchParam)}&perPage=${perPage}`;
      } else {
        url = `dishes?search=${encodeURIComponent(searchParam)}&perPage=${perPage}`;
      }

      const response = await axios.get(url);
      const { data, links } = response;

      dishes.value = [...dishes.value, ...data];
      dishesUrl.value.next = links?.next || null;
      dishesUrl.value.prev = links?.prev || null;
    } catch (error) {
      console.error('Ошибка загрузки блюд:', error);
      dishes.value = [];
    }
  }

  // поиск категории по slug
  const findCategoryBySlug = (slug) =>
    dishesCategories.value.find((category) => category.slug === slug);

  const findDishBySlug = (slug) =>
    dishes.value.find((dish) => dish.slug === slug);

  const resetDishes = () => {
    dishesUrl.value.next = null;
    dishesUrl.value.prev = null;
    dishes.value = [];
  };

  const resetDish = () => (currentDish.value = null);

  function setCategory(category) {
    currentCategory.value = category;
  }

  function setDish(dish) {
    currentDish.value = dish;
  }

  return {
    dishesCategories,
    currentCategory,
    dishes,
    currentDish,
    getDishesCategories,
    getDishesByCategory,
    getDishById,
    getDishBySlug,
    findCategoryBySlug,
    findDishBySlug,
    resetDishes,
    resetDish,
    setCategory,
    setDish,
    getDishesByDiscount,
    fetchDishes,
    dishesUrl
  };
});
