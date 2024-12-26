import axios from '@/axios/axios';
import { useOrderStore } from './orderStore';

export const useUserStore = defineStore('userStore', () => {
  const orderStore = useOrderStore();
  const currentUser = ref(null);
  const authResultMessage = ref('');
  const isLoggedIn = ref(false);
  const router = useRouter();

  async function getUser() {
    try {
      const user = await axios.get('/user');
      if (user?.id) {
        currentUser.value = user;
        isLoggedIn.value = true;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        isLoggedIn.value = false;
        currentUser.value = null;
      } else {
        console.log(error);
      }
    } finally {
      return currentUser.value;
    }
  }

  function updateUser(prop) {
    const user = { ...currentUser.value };
    const [key, value] = Object.entries(prop)[0];
    user[key] = value;

    currentUser.value = user;
  }

  async function login(email, password, rememberMe = false) {
    try {
      // Получаем данные ответа напрямую
      const { access_token } = await axios.post('login', {
        email,
        password,
        rememberMe
      });

      // Сохраняем токен в localStorage
      localStorage.setItem('access_token', access_token);

      // Теперь вызываем getUser
      await getUser();
      authResultMessage.value = 'You Logged In!';
    } catch (error) {
      console.log(error);

      let message = 'Помилка авторизації, спробуйте пізніше';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            message = 'Не вірний логін або пароль';
            break;
          case 422:
            message = error.response.data?.message || message;
            break;
          case 403:
            message = 'Ви вже авторизовані';
            break;
        }
      }
      authResultMessage.value = message;
      throw error;
    }
  }

  async function signup(email, password, rememberMe, name) {
    try {
      const data = {
        name,
        email,
        password
      };

      await axios.post('register', data);

      await login(email, password, rememberMe);
    } catch (error) {
      let message = 'Помилка реєстрації, спробуйте пізніше';
      message = error.response.data?.message || message;
      authResultMessage.value = message;
      console.log(error);
      throw error;
    }
  }

  async function logout() {
    isLoggedIn.value = false;
    currentUser.value = null;
    try {
      await axios.post('logout');
      localStorage.removeItem('access_token');
    } catch (error) {
      console.log(error);
    }
  }

  watch(isLoggedIn, (newValue) => {
    if (!newValue) {
      orderStore.resetUserOrders();
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push({ name: 'home' });
      }
    }

    if (newValue) {
      const redirectPath = router.currentRoute.value.query.redirect;
      if (redirectPath) {
        router.push(redirectPath);
      }
    }
  });

  const setAuthResult = (value) => (authResultMessage.value = value);

  return {
    currentUser,
    authResultMessage,
    isLoggedIn,
    login,
    signup,
    logout,
    setAuthResult,
    getUser,
    updateUser
  };
});
