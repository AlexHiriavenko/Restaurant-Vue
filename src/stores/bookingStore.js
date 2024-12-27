import axios from '@/axios/axios';

export const useBookingStore = defineStore('bookingStore', () => {
  const tables = ref([]);
  const userReservations = ref([]);

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
      return await axios.post(url, data);
    } catch (error) {
      throw error;
    }
  }

  async function getUserReservations(user_id) {
    const url = user_id
      ? `/booking/active_reservations/user/${user_id}`
      : '/booking/active_reservations/user/';

    try {
      userReservations.value = await axios.get(url);
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelReservation(id) {
    try {
      await axios.delete(`/booking/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async function getBookingByDate(table_id, reservation_date) {
    try {
      const response = await axios.get('/booking/date', {
        params: {
          table_id,
          reservation_date
        }
      });
      console.log(response);
      return response?.reservations || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return {
    tables,
    getTables,
    createReservation,
    userReservations,
    getUserReservations,
    cancelReservation,
    getBookingByDate
  };
});
