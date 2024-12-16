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

  async function createReservation(data, user_id) {
    const url = user_id
      ? `/booking/store/user/${user_id}`
      : '/booking/store/user/';

    try {
      const res = await axios.post(url, data);
      console.log(res);
    } catch (error) {
      throw error;
    }
  }

  return {
    tables,
    getTables,
    createReservation
  };
});
