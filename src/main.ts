import { createApp } from 'vue';

import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/css/main.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import i18n from '@/i18n/index';

import store from './store';
import router from './router';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus).use(store).use(router).use(i18n).mount('#app');
