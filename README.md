# Restaurant. Vue3 Composition API. Frontend.

## Описание

- Тема: Платформа для автоматизации ресторана
- Функционал: заказы блюд, бронирования столиков, аналитика, формирование и отправка отчетов, real-time уведомления.

## Frontend чать

- клиентская часть реализована в репозитории [Restaurant-Vue](https://github.com/AlexHiriavenko/Restaurant-Vue) и запускается на http://localhost:5173/Restaurant-Vue/ (адрес задан жестко если этот порт занят будет ошибка);
- админ панель реализована на Laravel Blade шаблонах и доступна по url: http://localhost:8080/ (ветка main) ; https://localhost:8443/ (ветка ws) .

## Переменные окружения

- VITE_BASE_URL=http://localhost:8080/api/ для ветки main
- VITE_BASE_URL=https://localhost:8443/api/ для ветки ws
- VITE_PUSHER_APP_KEY= значение это ваш апи кей предоставленный [pusher](https://pusher.com/)

## Более подробную инфо смотрите [тут](https://github.com/AlexHiriavenko/Restaurant-Laravel)
