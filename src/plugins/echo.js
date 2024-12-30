import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let pusher = (window.Pusher = Pusher);

let echo;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: false
});

echo = window.Echo;

export { echo, pusher };
