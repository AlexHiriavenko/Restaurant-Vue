import './assets/styles/main.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import directives from './directives'
import ModalDialog from '@/components/general/ModalDialog.vue'
import LoaderSpinner from './components/general/LoaderSpinner.vue'
import App from './App.vue'
import router from './router'

// подключение иконок mdi-icons
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    iconfont: 'mdi'
  }
})

const app = createApp(App)

app
  .use(vuetify)
  .use(createPinia())
  .use(router)
  // глобальное подключение компонентов
  .component('ModalDialog', ModalDialog)
  .component('LoaderSpinner', LoaderSpinner)

// глобальное подключение директив
directives.forEach((directive) => {
  app.directive(directive.name, directive)
})

app.mount('#app')
