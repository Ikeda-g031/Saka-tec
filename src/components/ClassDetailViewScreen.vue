<!--
作成者：伊藤聖㮈
初版作成者：土田勇斗
変更履歴：
6/21 22:40
-->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { timetableService } from '../services/database.js'

const router = useRouter()
const route = useRoute()

// 表示する講義情報
const course = ref({
  id: null,
  name: '',
  teacher: '',
  credits: 0,
  day: 0,
  period: 1,
  room: '',
  syllabusUrl: '',
  note: '',
  color: 'blue'
})

// 授業データを読み込む
const loadCourseData = async () => {
  try {
    const classId = parseInt(route.query.id)
    if (classId) {
      const classes = await timetableService.getAllClasses()
      const foundClass = classes.find(c => c.id === classId)
      if (foundClass) {
        course.value = foundClass
      }
    }
  } catch (error) {
    console.error('授業データ読み込みエラー:', error)
  }
}

// コンポーネントマウント時にデータを読み込み
onMounted(async () => {
  await loadCourseData()
})

// 戻る処理（画面遷移）
const goBack = () => {
  router.back()
}

// 曜日・時限を表示用テキストに変換
const getDayPeriodText = (day, period) => {
  const dayNames = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日']
  const dayText = dayNames[day] || '未設定'
  const periodText = period === 'lunch' ? '昼' : `${period}限`
  return `${dayText} ${periodText}`
}

// 編集ボタンが押された時の処理
const editCourse = () => {
  // 授業データを編集画面に渡す
  router.push({
    path: '/Classinfoedit',
    query: { 
      id: course.value.id,
      edit: 'true'
    }
  })
}

// 削除ボタンが押された時の処理
const deleteCourse = async () => {
  if (!course.value.id) {
    alert('削除対象の授業が見つかりません。')
    return
  }

  // 確認ダイアログを表示
  const confirmDelete = confirm(`「${course.value.name}」を削除しますか？\nこの操作は取り消せません。`)
  
  if (confirmDelete) {
    try {
      // データベースから削除
      await timetableService.deleteClass(course.value.id)
      
      alert('授業を削除しました。')
      
      // ホーム画面に戻る
      router.push('/')
      
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました。もう一度お試しください。')
    }
  }
}
</script>

<template>
  <div class="course-detail-screen min-h-screen bg-gray-100">
    <!-- ヘッダー -->
    <div class="header">
      <button class="nav-button" @click="goBack">‹</button>
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
        <p>単位数: {{ course.credits }}</p>
        <p>開講時期: {{ getDayPeriodText(course.day, course.period) }}</p>
        <p>教室: {{ course.room }}</p>
      </div>

      <!-- シラバス -->
      <div class="card" v-if="course.syllabusUrl">
        <h3 class="card-title">シラバスURL</h3>
        <a :href="course.syllabusUrl" class="link" target="_blank">
          {{ course.syllabusUrl }}
        </a>
      </div>

      <!-- 授業概要 -->
      <div class="card" v-if="course.note">
        <h3 class="card-title">授業概要／備考</h3>
        <p>{{ course.note }}</p>
      </div>

      <!-- 削除ボタン -->
      <div class="delete-section">
        <button class="delete-button" @click="deleteCourse">
          🗑️ この授業を削除
        </button>
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

/* 削除セクション */
.delete-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

.delete-button {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-button:hover {
  background-color: #dc2626;
}

.delete-button:active {
  background-color: #b91c1c;
}
</style>
