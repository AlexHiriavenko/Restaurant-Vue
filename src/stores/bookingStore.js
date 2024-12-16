import axios from '@/axios/axios';

export const useBookingStore = defineStore('bookingStore', () => {
  const tables = ref([]);

  async function getTables() {
    try {
      tables.value = await axios.get('booking/tables');
    } catch (error) {
      console.log(error);
    }
  }

  async function createReservation(data) {
    try {
      const res = await axios.post('booking/store', data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    tables,
    getTables,
    createReservation
  };
});
