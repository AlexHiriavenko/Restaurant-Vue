export const useContentStore = defineStore('eventsStore', () => {
  const content = ref(false);

  function getContent() {
    // тут должен быть запрос на сервер и получение данных
    // setTimeout(() => (content.value = true), 1600)
    content.value = true;
  }

  return {
    content,
    getContent
  };
});
