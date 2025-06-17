<script setup>
// プロパティを受け取る
const props = defineProps(['msg'])
</script>

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Vue.jsの学習を始めましょう！
    </p>
    <p>
      これはシンプルなVueコンポーネントの例です。
    </p>
  </div>
</template>

<style scoped>
.hello {
  margin: 40px 0;
}

h1 {
  color: #42b883;
  font-size: 2rem;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 20px 0;
}
</style>
