<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title>Завантажте свій аватар</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="file"
          label="Оберіть зображення"
          accept="image/*"
          show-size
          :multiple="false"
        ></v-file-input>

        <!-- Превью изображения -->
        <v-img
          v-if="previewUrl"
          :src="previewUrl"
          max-width="300"
          class="mt-4"
        ></v-img>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="uploadFile" :disabled="!file || loading">
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="white"
            size="20"
          ></v-progress-circular>
          <span v-else>Застосувати</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import axios from 'axios';
import axiosFormData from '@/axios/axiosFormData';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const file = ref(null); // Хранит выбранный файл
const previewUrl = ref(null); // Хранит ссылку на превью изображения
const loading = ref(false); // Состояние загрузки

// Следим за file и создаём превью, когда файл выбран
watch(file, (newFile) => {
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile);
    console.log('Файл выбран:', newFile);
  } else {
    previewUrl.value = null;
  }
});

const uploadFile = async () => {
  if (!file.value) return;

  loading.value = true;
  const formData = new FormData();
  formData.append('avatar', file.value);

  try {
    // Используем axiosFormData
    const response = await axiosFormData.post('user/avatar', formData);

    console.log('Ответ от сервера:', response);
    userStore.updateUser({ avatar: response.avatar_url });
    alert('Файл успешно загружен!');

    // Очистка состояния
    file.value = null;
    previewUrl.value = null;
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    alert('Произошла ошибка при загрузке файла.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-container {
  max-width: 500px;
  margin: 0 auto;
}
.v-img {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
