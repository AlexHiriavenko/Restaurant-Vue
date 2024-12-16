<template>
  <div
    class="pa-4 bg-white"
    style="max-width: 600px; width: 460px; min-width: 280px"
  >
    <h1 class="text-h5 text-center mb-4">Форма Бронювання</h1>
    <div class="d-flex justify-center align-center">
      <LoaderSpinner
        :isLoading="isLoading"
        :isFixed="false"
        :size="70"
        color="white"
      />
    </div>
    <v-form v-show="!isLoading" ref="form">
      <!-- Номер столика -->
      <v-col cols="12" md="12">
        <v-select
          v-model="formData.tableNumber"
          :items="tableOptions"
          label="Номер столика"
          outlined
          required
          :rules="[requiredRule]"
          validate-on="input"
          @update:modelValue="updateCapacity"
        ></v-select>
      </v-col>

      <!-- Количество персон -->
      <v-col cols="12" md="12">
        <v-text-field
          v-model="formData.capacity"
          label="Кількість персон"
          outlined
          readonly
          :rules="[requiredRule]"
          validate-on="blur"
        ></v-text-field>
      </v-col>

      <!-- Дата -->
      <v-col cols="12" md="12">
        <v-menu location="top" :close-on-content-click="false" v-model="menu">
          <template #activator="{ props }">
            <v-text-field
              prepend-inner-icon="mdi-calendar"
              v-bind="props"
              v-model="formattedDate"
              readonly
              label="Дата"
            ></v-text-field>
          </template>
          <v-date-picker
            color="primary"
            v-model="formData.date"
            locale="uk"
            @update:modelValue="menu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <!-- Время -->
      <v-col cols="12" md="12">
        <v-select
          prepend-inner-icon="mdi-clock-outline"
          v-model="formData.time"
          :items="timeOptions"
          label="Час"
          outlined
          required
          :rules="[requiredRule, validTimeRule]"
          validate-on="blur"
        ></v-select>
      </v-col>

      <!-- Продолжительность -->
      <v-col cols="12" md="12">
        <v-select
          prepend-inner-icon="mdi-clock-outline"
          v-model="formData.duration"
          :items="[2, 4, 6]"
          label="Тривалість (години)"
          outlined
          required
          :rules="[requiredRule]"
          validate-on="input"
        ></v-select>

        <v-col cols="12">
          <v-text-field
            prepend-inner-icon="mdi-cellphone"
            v-model="formData.phoneNumber"
            label="Телефон"
            type="tel"
            color="black"
            :rules="[
              (value) => /^\d*$/.test(value) || 'Можно вводить только цифры'
            ]"
            required
            max-width="460"
          ></v-text-field>
        </v-col>
      </v-col>
      <v-text-field
        v-model="formData.name"
        prepend-inner-icon="mdi-account"
        label="Ім'я'"
      ></v-text-field>
      <!-- Кнопка отправки -->
      <v-col cols="12" class="text-center mt-4">
        <v-btn color="primary" :disabled="!formIsValid" @click="submitBooking">
          Забронювати
        </v-btn>
      </v-col>
    </v-form>
  </div>
  <ModalDialog ref="modalRef">
    <template #modal-content>
      <v-container class="d-flex flex-column align-center justify-center">
        <v-card-title class="text-h5">{{ resultMessage }}</v-card-title>
        <v-btn
          text="OK"
          :color="buttonColor"
          @click="modalRef.closeModal()"
          v-focus
        ></v-btn>
      </v-container>
    </template>
  </ModalDialog>
</template>

<script setup>
import { useBookingStore } from '@/stores/bookingStore';

const bookingStore = useBookingStore();

onMounted(async () => {
  await bookingStore.getTables(); // Получение данных из хранилища
});

// Номера столиков
const tableOptions = computed(() =>
  bookingStore.tables.map((table) => table.number)
);

const menu = ref(false);

// Данные формы
const formData = reactive({
  tableNumber: null,
  capacity: '',
  date: new Date(),
  time: '',
  duration: null,
  phoneNumber: '',
  name: ''
});

const modalRef = ref(null);
const isLoading = ref(false);
const resultMessage = ref('');
const buttonColor = ref('success');

// Вычисляемое свойство для форматированной даты
const formattedDate = computed(() => {
  if (!formData.date) return ''; // Если дата не выбрана, возвращаем пустую строку

  const date = new Date(formData.date);

  const dayOfWeek = daysUk[date.getDay()]; // День недели
  const day = date.getDate(); // День месяца
  const month = monthsUk[date.getMonth()]; // Месяц
  const year = date.getFullYear(); // Год

  // Возвращаем дату в формате "п’ятниця, 13 грудня 2024"
  return `${dayOfWeek}, ${day} ${month} ${year}`;
});

// Проверка общей валидности формы
const formIsValid = computed(() => Object.values(formData).every((el) => !!el));

// Валидационные правила
const requiredRule = (value) => !!value || 'Обязательное поле';
const validTimeRule = (value) =>
  /^\d{2}:\d{2}$/.test(value) || 'Некорректное время';

// Обновляем вместимость при выборе столика
function updateCapacity(tableNumber) {
  const selectedTable = bookingStore.tables.find(
    (table) => table.number === tableNumber
  );
  formData.capacity =
    selectedTable.capacity === 2
      ? 'на 1 або 2 персони'
      : selectedTable.capacity === 4
        ? 'на 3 або 4 персони'
        : 'від 5 до 8 персон';
}

function calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = (hours + duration) % 24; // Ограничиваем часы диапазоном 0-23
  return `${endHours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

const timeOptions = Array.from({ length: 22 }, (_, i) => {
  const startHour = 9; // Час начала
  const startMinute = 30; // Минута начала
  const totalMinutes = startMinute + i * 30; // Общее количество минут от начала
  const hours = Math.floor(totalMinutes / 60) + startHour; // Часы
  const minutes = totalMinutes % 60; // Минуты
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

const monthsUk = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня'
];
const daysUk = [
  'неділя',
  'понеділок',
  'вівторок',
  'середа',
  'четвер',
  'п’ятниця',
  'субота'
];

function isValid() {
  if (formData.tableNumber < 1 || isNaN(formData.tableNumber)) {
    return false;
  }

  const parsedDate = new Date(formData.date);
  if (isNaN(parsedDate)) {
    return false;
  }

  if (!/^\d+$/.test(formData.phoneNumber)) {
    return false;
  }

  return true;
}

// Отправка данных
async function submitBooking() {
  if (!isValid()) {
    console.log('ошибка валидации');
    return;
  }

  // Формирование объекта бронирования
  const startTime = formData.time;
  const endTime = calculateEndTime(startTime, formData.duration);
  const dateObject = new Date(formData.date);
  const formattedDate = dateObject.toISOString().split('T')[0];

  const bookingData = {
    user_id: 1, // Заменить на реального пользователя
    table_id: formData.tableNumber,
    reservation_date: formattedDate,
    start_time: startTime,
    end_time: endTime,
    phone_number: formData.phoneNumber,
    name: formData.name
  };

  isLoading.value = true;
  try {
    await bookingStore.createReservation(bookingData);
    resultMessage.value = 'Столик успішно заброньовано !';
    formData.tableNumber = null;
    formData.capacity = '';
    formData.date = new Date();
    formData.time = '';
    formData.duration = null;
    formData.phoneNumber = '';
    formData.name = '';
  } catch (error) {
    if (error.status === 401) {
      resultMessage.value = 'Ви не авторизовані. Пройдіть авторизацію';
    } else {
      resultMessage.value = error.response.data?.message || error.message;
    }
    buttonColor.value = 'error';
    console.log(error);
  } finally {
    isLoading.value = false;
    modalRef.value.openModal();
  }
}
</script>

<style>
.v-form .v-col-12 {
  padding: 0;
}
</style>
