import Main from '../views/Main.vue'
import Home from '../views/Home.vue'
import Menu from '../views/Menu.vue'
import Shopbag from '../views/Shopbag.vue'
import My from '../views/My.vue'
export const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '/home',
        alias:'/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/menu',
        name: 'Menu',
        component: Menu,
      },
      {
        path: '/shopbag',
        name: 'Shopbag',
        component: Shopbag,
      },
      {
        path: '/my',
        name: 'My',
        component: My,
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/placeorder',
    name: 'PlaceOrder',
    component: () => import('../views/PlaceOrder.vue')
  },
  {
    path: '/newaddress/:aid?',
    name: 'Newaddress',
    component: () => import('../views/Newaddress.vue')
  },
  {
    path: '/orderstatus/:aid?',
    name: 'Orderstatus',
    component: () => import('../views/Orderstatus.vue')
  },
  {
    path: '/personal/',
    name: 'Personal',
    component: () => import('../views/Personal.vue')
  },
  {
    path: '/core/',
    name: 'Core',
    component: () => import('../views/Core.vue')
  },
  {
    path: '/receivingaddress/',
    name: 'Receivingaddress',
    component: () => import('../views/Receivingaddress.vue')
  },
  {
    path: '/collection/',
    name: 'Collection',
    component: () => import('../views/Collection.vue')
  },
  {
    path: '/search/',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
];