<template>
  <v-sheet class="mx-auto" width="300">
    <v-form ref="form" fast-fail @submit.prevent="onSubmit">
      <v-card-title v-if="formTitle" class="text-center">
        {{ formTitle }}
      </v-card-title>

      <v-text-field
        v-if="authType === 'signup'"
        v-focus="authType === 'signup'"
        v-model.trim="name"
        :rules="nameRules"
        label="Name"
        type="text"
        autocomplete="name"
      ></v-text-field>

      <v-text-field
        v-model.trim="email"
        v-focus="authType === 'login'"
        :rules="emailRules"
        label="Email"
        placeholder="admin@admin.com"
        type="email"
        autocomplete="email"
      ></v-text-field>

      <v-text-field
        v-model.trim="password"
        :rules="passwordRules"
        label="Password"
        placeholder="654321"
        type="password"
        autocomplete="current-password"
      ></v-text-field>

      <v-checkbox
        v-model="rememberMe"
        label="Remember Me"
        class="mt-2"
      ></v-checkbox>

      <!-- Динамический текст и кнопка переключения -->
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
import { ref } from 'vue';

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

const name = ref('');
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const form = ref(null);

const { emailRules, passwordRules, nameRules } = useAuthFormValidation();

async function onSubmit() {
  const { valid } = await form.value.validate();

  if (valid) {
    emit('update:isLoading', true);
    try {
      await currentSubmitMethod(
        email.value,
        password.value,
        rememberMe.value,
        name.value
      );
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
