/*
作成者：土田勇斗
初版作成者：土田勇斗
変更履歴：
6/21 22:52
本間遥人
画面遷移を行いたく思い、import router from './router'を追加。
ソース内容：
- Vue.jsのエントリーポイント(開始地点)
- HTMLとVue.jsをつなげる。
*/


import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'

createApp(App).use(router).mount('#app')
