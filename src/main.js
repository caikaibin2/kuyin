import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'

// 设置Vue原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

// 配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002';

// axios 拦截器 在发起请求之前执行
axios.interceptors.request.use(config =>{
  //处理post请求参数, 进行参数序列化
  if (config.method == 'post') {
    //序列化post请求参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }

    //重新赋值config.data
    config.data = paramsString.slice(0, -1);

    // console.log('config.data ==> ', config.data);

  }

  //必须返回config
  // console.log("config ==>", config);
  return config;
})

Vue.use(VueAxios, axios)
Vue.use(VueCookies)

import {
  NavBar,
  Field,
  Button,
  Form,
  Popup,
  Toast,
  Tabbar, 
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Dialog,
  Checkbox,
  SwipeCell,
  Card,
  SubmitBar,
  List,
  Empty,
  AddressList,
  AddressEdit,
  Area,
  Tab,
  Tabs,
  Uploader,
  Cell
} from 'vant'

import 'lib-flexible/flexible'

Vue.use(NavBar)
  .use(Field)
  .use(Button)
  .use(Form)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Dialog)
  .use(Checkbox)
  .use(SwipeCell)
  .use(Card)
  .use(SubmitBar)
  .use(List)
  .use(Empty)
  .use(AddressList)
  .use(AddressEdit)
  .use(Area)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
  .use(Cell)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
