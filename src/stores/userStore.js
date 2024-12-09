import axios from '@/axios/axios';

export const useUserStore = defineStore('userStore', () => {
  const currentUser = ref(null);
  const authResultMessage = ref('');
  const isLoggedIn = ref(false);
  const router = useRouter();

  async function getUser() {
    try {
      const user = await axios.get('/user');
      console.log(user);
      if (user?.id) {
        currentUser.value = user;
        isLoggedIn.value = true;
      }
      return currentUser.value;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        isLoggedIn.value = false;
        currentUser.value = null;
      } else {
        console.log(error);
        console.error(
          'An error occurred while fetching the user:',
          error.message
        );
      }
    }
  }

  async function login(email, password) {
    try {
      // Получаем данные ответа напрямую
      const { access_token } = await axios.post('login', {
        email,
        password
      });

      // Сохраняем токен в localStorage
      localStorage.setItem('access_token', access_token);

      // Теперь вызываем getUser
      await getUser();
      authResultMessage.value = 'You Logged In!';
    } catch (error) {
      if (error.response && error.response.status === 401) {
        authResultMessage.value = 'Не вірний логін або пароль';
      } else if (error.response && error.response.status === 403) {
        authResultMessage.value = 'Ви вже авторизовані';
      } else {
        console.error('An unexpected error occurred:', error.message);
        console.log(error);
        authResultMessage.value = 'помилка авторизації, спробуйте пізніше';
      }
    }
  }

  async function signup(email, password, name = 'NoName') {
    console.log(name, password, email);
    alert('implement your own registration method');
  }

  async function logout() {
    try {
      await axios.post('logout');
    } catch (error) {
      console.error('Logout failed:', error.message);
    } finally {
      isLoggedIn.value = false;
      currentUser.value = null;
      localStorage.removeItem('access_token');
    }
  }

  watch(isLoggedIn, (newValue) => {
    if (!newValue) {
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push({ name: 'home' });
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
    getUser
  };
});
