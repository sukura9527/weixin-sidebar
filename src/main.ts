import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
// import router from './router'

// 引入 Vant
import Vant from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)
import {
    CellGroup,
    Cell,
    Tag,
    Icon,
    Button,
    Loading,
    Tab,
    Tabs,
    Switch,
    Field,
    Toast,
    Collapse,
    CollapseItem,
    Popup,
    Picker
} from 'vant';
// app.use(createPinia())
// app.use(router)
// 全局注册常用组件
app.use(CellGroup)
    .use(Cell)
    .use(Tag)
    .use(Icon)
    .use(Button)
    .use(Loading)
    .use(Tab)
    .use(Tabs)
    .use(Switch)
    .use(Field)
    .use(Toast)
    .use(Collapse)
    .use(CollapseItem)
    .use(Popup)
    .use(Picker);
app.mount('#app')
