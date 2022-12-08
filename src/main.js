var i = 0
console.log(i+=1)
import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import { ArrowDown } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// app.component('ArrowDown', ArrowDown)

console.log(i+=1)
app.config.globalProperties.$filters = {
    toRmb(cents, fix = 2) {
        if (cents == null) {
            return '未知'
        }
        return `￥${(cents / 100).toFixed(fix)}`
    },
    formatDate(dateStr, template = 'YYYY-MM-DD'){
        const date = dayjs(dateStr);
        // template = `yyyy-MM-dd hh:mm:ss`
        return date.format(template);
    }
}

console.log(i+=1)
app.mount('#app')

// const { DateTime } = require("luxon");
// app.config.globalProperties.$luxonDateTime = DateTime;
