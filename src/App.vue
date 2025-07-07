<!--
作成者：土田勇斗
初版作成者：土田勇斗
変更履歴：
6/21 22:52
本間遥人
HTMLの部分
  <div id="app">
    <HomeScreen />
  </div>から
    <div id="app">
    <router-view />
  </div>へ変更。画面遷移が目的。
ソース内容：
- Vueアプリの一番上の親コンポーネント(大黒柱)
- 授業スケジュール管理システムのホーム画面を表示
-->

<!-- JavaScriptの部分 -->
<script setup>
<<<<<<< HEAD
import Classinfoedit from './components/Classinfoedit.vue'
=======
import HomeScreen from './components/HomeScreen.vue'
import ClassDetailViewScreen from './components/ClassDetailViewScreen.vue'
>>>>>>> develop
</script>

<!-- HTMLの部分 -->
<template>
  <div id="app">
<<<<<<< HEAD
    <Classinfoedit />
=======
    <router-view />
>>>>>>> develop
  </div>
</template>

<!-- CSSの部分 -->
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

#app {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  display: block;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* すべてのメディアクエリでパディングなし - 完全フルスクリーン */
</style>
