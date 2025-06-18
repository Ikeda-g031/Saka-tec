<!--
作成者：土田勇斗
初版作成者：土田勇斗
変更履歴：
ソース内容：
- Vueアプリの一番上の親コンポーネント(大黒柱)
- 他のコンポーネントを配置する。
-->

<!-- JavaScriptの部分 -->
<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<!-- HTMLの部分 -->
<template>
  <div id="app">
    <header>
      <img alt="Vue logo" class="logo" src="/src/assets/logo.svg" width="125" height="125" />
      <HelloWorld msg="Welcome to Your Vue.js App" />
    </header>
  </div>
</template>

<!-- CSSの部分 -->
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  margin-bottom: 20px;
}
</style>
