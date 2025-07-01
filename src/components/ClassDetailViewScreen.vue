<script setup>
import { ref } from 'vue'

// 表示する講義情報（仮データ）
const course = ref({
  name: 'システム論',
  teacher: '田中 教授',
  credit: 2,
  term: '前期 月曜1限',
  room: '201F',
  syllabusUrl: 'https://example.com/syllabus/sys101',
  description: 'システムの基礎を学ぶ。'
})

// 戻る処理（consoleログにとどめています）
const goBack = () => {
  console.log('戻るボタンが押されました')
}

const editCourse = () => {
  console.log('編集ボタンが押されました')
}
</script>

<template>
  <div class="course-detail-screen min-h-screen bg-gray-100">
    <!-- ヘッダー -->
    <div class="header">
      <button class="nav-button" @click="goBack">←</button>
      <h1 class="title">{{ course.name }}</h1>
      <button class="nav-button" @click="editCourse">
        ✎
      </button>
    </div>

    <!-- 内容カード -->
    <div class="content">
      <!-- 講義情報 -->
      <div class="card">
        <h2 class="course-title">{{ course.name }}</h2>
        <p>教員名: {{ course.teacher }}</p>
        <p>単位数: {{ course.credit }}</p>
        <p>開講時期: {{ course.term }}</p>
        <p>教室: {{ course.room }}</p>
      </div>

      <!-- シラバス -->
      <div class="card">
        <h3 class="card-title">シラバスURL</h3>
        <a :href="course.syllabusUrl" class="link" target="_blank">
          {{ course.syllabusUrl }}
        </a>
      </div>

      <!-- 授業概要 -->
      <div class="card">
        <h3 class="card-title">授業概要／備考</h3>
        <p>{{ course.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-detail-screen {
  width: 100%;
  background-color: #f1f5f9;
}

/* ヘッダー */
.header {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 10px;
  min-height: 60px;
}

.nav-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.title {
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  flex: 1;
}

/* 内容 */
.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.course-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 10px;
}

.card-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.link {
  color: #2563eb;
  text-decoration: underline;
}
</style>
