import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import HomeView from '@/views/HomeView.vue';
import Menu from '@/views/Menu.vue';
import Category from '@/views/Category.vue';
import DishView from '@/views/DishView.vue';
import PromoDishes from '@/views/PromoDishes.vue';
import BookTable from '@/views/BookTable.vue';
import CartView from '@/views/CartView.vue';
import AdminPanel from '@/views/AdminPanel.vue';
import NotFound from '@/views/NotFound.vue';
import OrdersHistory from '@/views/OrdersHistory.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Головна', showInTabs: true }
  },
  {
    path: '/menu',
    name: 'menu',
    component: Menu,
    meta: { title: 'Меню', showInTabs: true }
  },
  {
    path: '/promo',
    name: 'promo',
    component: PromoDishes,
    meta: { title: 'Знижки', showInTabs: true }
  },
  {
    path: '/menu/:categorySlug',
    name: 'category',
    component: Category,
    meta: { title: 'Категорія' }
  },
  {
    path: '/menu/:categorySlug/:dishSlug',
    name: 'dish',
    component: DishView,
    meta: { title: 'Страва' }
  },
  {
    path: '/orders-history',
    name: 'orders-history',
    component: OrdersHistory,
    meta: { title: 'Історія Замовлень', requiresAuth: true, showInTabs: true }
  },
  {
    path: '/booking',
    name: 'booking',
    component: BookTable,
    meta: { title: 'Бронювання', requiresAuth: true, showInTabs: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: { title: 'Корзина', requiresAuth: false, showInTabs: false }
  },
  {
    path: '/admin-panel',
    name: 'admin-panel',
    component: AdminPanel,
    meta: {
      title: 'Admin',
      requiresAuth: true,
      requiresAdmin: true,
      showInTabs: false
    }
  },
  {
    path: '/auth-required',
    name: 'auth-required',
    component: NotFound,
    meta: { title: 'Authorization Required', showInTabs: false }
  },
  {
    path: '/admin-required',
    name: 'admin-required',
    component: NotFound,
    meta: { title: 'Authorization Required', showInTabs: false }
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: NotFound,
    meta: { title: '404', showInTabs: false }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Глобальный перехват маршрутов для проверки авторизации
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  // if (to.meta.requiresAuth) {
  //   if (!userStore.isLoggedIn) {
  //     next({ name: 'auth-required', query: { redirect: to.fullPath } });
  //     return;
  //   }

  //   if (to.meta.requiresAdmin && userStore.currentUser.role !== 'admin') {
  //     next({ name: 'admin-required', query: { redirect: to.fullPath } });
  //     return;
  //   }
  // }

  // next();
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // Если пользователь не залогинен и пытается перейти на защищённый маршрут
    const redirectPath = to.fullPath; // Целевой маршрут для редиректа

    // Остаёмся на текущем маршруте, добавляя ?redirect=
    next({
      path: from.path,
      query: { ...from.query, redirect: redirectPath }
    });
    return;
  }

  if (to.meta.requiresAdmin && userStore.currentUser?.role !== 'admin') {
    next({ name: 'admin-required', query: { redirect: to.fullPath } });
    return;
  }

  next();
});

export default router;
