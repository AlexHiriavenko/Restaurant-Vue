import axios from '@/axios/axios';
import { ref } from 'vue';

export const useDishesStore = defineStore('dishesStore', () => {
  const dishesCategories = ref([]);
  const currentCategory = ref(null);
  const dishes = ref([]);
  const currentDish = ref(null);

  async function getDishesCategories() {
    dishesCategories.value = (await axios.get('categories')) || [];
  }

  async function getDishesByCategory(id = null) {
    if (!id) {
      dishes.value = [];
    }
    dishes.value = (await axios.get(`categories/${id}/dishes`)) || [];
  }

  async function getDishById(id) {
    currentDish.value = (await axios.get(`dishes/${id}`)) || null;
  }

  async function getDishBySlug(slug) {
    currentDish.value = (await axios.get(`dishes/${slug}`)) || null;
  }

  // поиск категории по slug
  const findCategoryBySlug = (slug) =>
    dishesCategories.value.find((category) => category.slug === slug);

  const findDishBySlug = (slug) =>
    dishes.value.find((dish) => dish.slug === slug);

  const resetDishes = () => (dishes.value = []);
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
    setDish
  };
});
