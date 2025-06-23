<script setup>
import { ref } from 'vue'

// サンプルデータ（実際は props や API 連携で取得可能）
const course = ref({
  name: 'システム論',
  teacher: '田中 教授',
  credit: 2,
  time: '前期 月曜1限',
  room: '201F',
  syllabusUrl: 'https://example.com/syllabus/sys101',
  description: 'システムの基礎を学ぶ。'
})

const goBack = () => {
  console.log('戻るボタンが押されました')
  // 実際にはルーター連携 (router.back()) などに接続
}

const editCourse = () => {
  console.log('編集アイコンが押されました')
  // 編集画面へ遷移など
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between px-4 py-3 bg-gray-800 text-white shadow">
      <button @click="goBack" class="text-xl">←</button>
      <h1 class="text-lg font-semibold">{{ course.name }}</h1>
      <button @click="editCourse">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5h2m-1 0v14m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      </button>
    </div>

    <!-- 本体カード -->
    <div class="p-4 space-y-4">
      <!-- 情報カード -->
      <div class="bg-white shadow rounded-lg p-4">
        <h2 class="text-blue-600 text-lg font-semibold mb-2">{{ course.name }}</h2>
        <p><strong>教員名:</strong> {{ course.teacher }}</p>
        <p><strong>単位数:</strong> {{ course.credit }}</p>
        <p><strong>開講時期:</strong> {{ course.time }}</p>
        <p><strong>教室:</strong> {{ course.room }}</p>
      </div>

      <!-- シラバスリンク -->
      <div class="bg-white shadow rounded-lg p-4">
        <h3 class="font-semibold mb-1">シラバスURL</h3>
        <a :href="course.syllabusUrl" class="text-blue-500 hover:underline" target="_blank">
          {{ course.syllabusUrl }}
        </a>
      </div>

      <!-- 授業概要 -->
      <div class="bg-white shadow rounded-lg p-4">
        <h3 class="font-semibold mb-1">授業概要／備考</h3>
        <p>{{ course.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 画面全体に影を与えるような余白 */
.min-h-screen {
  font-family: sans-serif;
}
</style>
