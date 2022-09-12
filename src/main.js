import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import { ArrowDown } from '@element-plus/icons-vue'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// app.component('ArrowDown', ArrowDown)
app.mount('#app')
