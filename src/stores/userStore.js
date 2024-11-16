export const useUserStore = defineStore('userStore', () => {
  const currentUser = ref(null)
  const authResultMessage = ref('')
  const isLoggedIn = ref(false)
  const router = useRouter()

  async function login(email, password) {
    const validValues = {
      user: {
        email: 'test@user.com',
        password: '123456'
      },
      admin: {
        email: 'admin@admin.com',
        password: '654321'
      }
    }

    function isUser(email, password) {
      return (
        email === validValues.user.email &&
        password === validValues.user.password
      )
    }

    function isAdmin(email, password) {
      return (
        email === validValues.admin.email &&
        password === validValues.admin.password
      )
    }

    if (isUser(email, password)) {
      authResultMessage.value = 'You Logged In!'
      const user = {
        name: 'testUser',
        role: 'user'
      }

      currentUser.value = user
      isLoggedIn.value = true
      return
    }

    if (isAdmin(email, password)) {
      authResultMessage.value = 'You Logged In!'
      const admin = {
        name: 'admin',
        role: 'admin'
      }

      currentUser.value = admin
      isLoggedIn.value = true
      return
    }

    authResultMessage.value = 'Invalid Credentials.'
    currentUser.value = null
    isLoggedIn.value = false
  }

  async function signup(email, password, name = 'NoName') {
    console.log(name, password, email)
    alert('implement your own registration method')
  }

  const logout = async () => {
    try {
      currentUser.value = null
      authResultMessage.value = ''
      isLoggedIn.value = false
    } catch (error) {
      authResultMessage.value = 'LogOut Error - try later'
    }
  }

  watch(isLoggedIn, (newValue) => {
    if (!newValue) {
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push({ name: 'home' })
      }
    }
  })

  const setAuthResult = (value) => (authResultMessage.value = value)

  return {
    currentUser,
    authResultMessage,
    isLoggedIn,
    login,
    signup,
    logout,
    setAuthResult
  }
})
