import { createApp } from 'vue'

import App from './App.vue'
import Router from './router'

import './styles/tailwind.scss'

const app = createApp(App).use(Router)

app.mount('#app')
