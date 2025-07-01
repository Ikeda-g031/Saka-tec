/*
作成者：本間遥人
変更履歴：6/21 22:51
ソース内容：
画面遷移。自身が担当しているJugyougai.vueを確認するために追加したので、他画面との整合性がとれるかはわからない
*/

import { createRouter, createWebHistory } from 'vue-router'
import HomeScreen from './components/HomeScreen.vue'
import Jugyogai from './components/Jugyogai.vue'  // ← Jugyogaiをインポート

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeScreen
  },
  {
    path: '/jugyogai',
    name: 'Jugyogai',
    component: Jugyogai
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
