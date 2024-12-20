<template>
  <v-sheet class="mx-auto" width="300">
    <v-form ref="form" fast-fail @submit.prevent="onSubmit">
      <v-card-title v-if="formTitle" class="text-center">
        {{ formTitle }}
      </v-card-title>

      <v-text-field
        v-if="authType === 'signup'"
        v-focus="authType === 'signup'"
        v-model.trim="formInputs.name"
        :rules="nameRules"
        label="Name"
        type="text"
        autocomplete="name"
      ></v-text-field>

      <v-text-field
        v-model.trim="formInputs.email"
        v-focus="authType === 'login'"
        :rules="emailRules"
        label="Email"
        placeholder="admin@admin.com"
        type="email"
        autocomplete="email"
      ></v-text-field>

      <v-text-field
        v-model.trim="formInputs.password"
        :rules="passwordRules"
        label="Password"
        placeholder="654321"
        type="password"
        autocomplete="current-password"
      ></v-text-field>

      <v-checkbox
        v-model="formInputs.rememberMe"
        label="Remember Me"
        class="mt-2"
      ></v-checkbox>

      <div class="d-flex mb-6 align-center ga-4">
        <span class="textcolor-grey">
          {{
            authType === 'login' ? 'Ще не зареєстровані?' : 'Вже зареєстровані?'
          }}
        </span>
        <v-btn
          text
          small
          density="compact"
          class="text-xs textcolor-grey"
          @click="toggleAuthType"
        >
          {{ authType === 'login' ? 'Signup' : 'Login' }}
        </v-btn>
      </div>

      <v-btn class="mt-2" type="submit" block>Submit</v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { useAuthFormValidation } from '@/composables/useAuthFormValidation';

const { currentSubmitMethod, authType } = defineProps({
  currentSubmitMethod: {
    type: Function,
    required: true
  },
  formTitle: {
    type: String,
    required: false,
    default: 'Form'
  },
  authType: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:isLoading', 'update:authType']);

// Создаем объект состояния формы
const formInputs = reactive({
  name: '',
  email: '',
  password: '',
  rememberMe: false
});

const form = ref(null);
const { emailRules, passwordRules, nameRules } = useAuthFormValidation();

// Инициализация из localStorage
onMounted(() => {
  const savedInputs = JSON.parse(
    localStorage.getItem('authSavedInputs') || '{}'
  );
  formInputs.name = savedInputs.name || '';
  formInputs.email = savedInputs.email || '';
  formInputs.password = savedInputs.password || '';
  formInputs.rememberMe = savedInputs.rememberMe || false;
});

// Сохранение изменений в localStorage при обновлении formInputs
watch(
  () => formInputs,
  (newInputs) => {
    localStorage.setItem('authSavedInputs', JSON.stringify(newInputs));
  },
  { deep: true } // следим за изменениями внутри объекта
);

async function onSubmit() {
  const { valid } = await form.value.validate();

  if (valid) {
    emit('update:isLoading', true);

    try {
      await currentSubmitMethod(
        formInputs.email,
        formInputs.password,
        formInputs.rememberMe,
        formInputs.name
      );

      // Успешная отправка: очищаем localStorage
      localStorage.removeItem('authSavedInputs');
    } catch (error) {
      console.error('Error during submission:', error);
    }

    emit('update:isLoading', false);
  }
}

function toggleAuthType() {
  const newAuthType = authType === 'login' ? 'signup' : 'login';
  emit('update:authType', newAuthType);
}
</script>
