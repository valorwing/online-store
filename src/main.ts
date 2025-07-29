import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { vClickOutside } from './directives/clickOutside'
import './assets/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Регистрируем директивы глобально
app.directive('click-outside', vClickOutside)

app.mount('#app')
