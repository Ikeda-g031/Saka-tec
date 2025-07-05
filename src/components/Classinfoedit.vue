<template>
  <div class="classinfoedit-screen">
    <!-- ヘッダー -->
    <div class="header">
      <button class="nav-button" @click="goBack">
        <span class="arrow">‹</span>
      </button>
      <h1 class="header-title">新規授業情報を入力</h1>
    </div>

    <!-- 入力フォーム -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form-content">
        <!-- 授業名 -->
        <div class="form-group">
          <label class="form-label">授業名</label>
          <input
            type="text"
            v-model="courseName"
            placeholder="例: 情報基礎"
            class="form-input"
            required
          />
        </div>
        <!-- 教員名 -->
        <div class="form-group">
          <label class="form-label">教員名</label>
          <input
            type="text"
            v-model="teacherName"
            placeholder="例: 山田 太郎"
            class="form-input"
            required
          />
        </div>
        <!-- 単位数 -->
        <div class="form-group">
          <label class="form-label">単位数</label>
          <input
            type="number"
            v-model.number="credits"
            placeholder="例: 2"
            class="form-input"
            min="1"
            required
          />
        </div>
        <!-- 開講時期 -->
        <div class="form-group">
          <label class="form-label">開講時期</label>
          <input
            type="text"
            v-model="term"
            placeholder="火曜 1限"
            class="form-input"
            required
          />
        </div>
        <!-- 教室 -->
        <div class="form-group">
          <label class="form-label">教室</label>
          <input
            type="text"
            v-model="classroom"
            placeholder="例: 201F"
            class="form-input"
          />
        </div>
        <!-- シラバスURL -->
        <div class="form-group">
          <label class="form-label">シラバスURL</label>
          <input
            type="url"
            v-model="syllabusUrl"
            placeholder="https://example.com/syllabus"
            class="form-input"
          />
        </div>
        <!-- 授業概要/備考 -->
        <div class="form-group">
          <label class="form-label">授業概要/備考</label>
          <textarea
            v-model="notes"
            placeholder="持ち物やメモなど"
            class="form-textarea"
          ></textarea>
        </div>
        <!-- セルの色 -->
        <div class="form-group">
          <label class="form-label">セルの色</label>
          <select v-model="cellColor" class="form-select">
            <option value="skyblue">スカイブルー</option>
            <option value="lightgreen">ライトグリーン</option>
            <option value="lightyellow">ライトイエロー</option>
          </select>
        </div>
        <!-- 繰り返し設定 -->
        <div class="form-group">
          <label class="form-label">繰り返し設定</label>
          <input
            type="text"
            v-model="repeat"
            placeholder="例: 毎週月曜 1限"
            class="form-input"
          />
        </div>
        <!-- 通知設定 -->
        <div class="form-group">
          <label class="form-label">通知設定</label>
          <select v-model="notification" class="form-select">
            <option value="10分前">10分前</option>
            <option value="30分前">30分前</option>
            <option value="1時間前">1時間前</option>
            <option value="なし">なし</option>
          </select>
        </div>
        <!-- 保存ボタン -->
        <button type="submit" class="submit-button">
          保存する
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const courseName = ref('')
const teacherName = ref('')
const credits = ref('')
const term = ref('')
const classroom = ref('')
const syllabusUrl = ref('')
const notes = ref('')
const cellColor = ref('skyblue')
const repeat = ref('')
const notification = ref('10分前')

const goBack = () => {
  router.back()
}

const submitForm = () => {
  const classData = {
    courseName: courseName.value,
    teacherName: teacherName.value,
    credits: credits.value,
    term: term.value,
    classroom: classroom.value,
    syllabusUrl: syllabusUrl.value,
    notes: notes.value,
    cellColor: cellColor.value,
    repeat: repeat.value,
    notification: notification.value
  }

  console.log('登録された授業情報:', classData)
  alert('保存しました')
  router.push('/')
}
</script>

<style scoped>
.classinfoedit-screen {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

/* ヘッダー */
.header {
  background: linear-gradient(135deg, #37455C 0%, #37455C 100%);
  color: white;
  display: flex;
  align-items: center;
  padding: 15px 10px;
}

.header-title {
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.nav-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* フォーム */
.form-container {
  padding: 20px;
  flex: 1;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

.form-input,
.form-textarea,
.form-select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  color: #333;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.submit-button {
  margin-top: 24px;
  width: 100%;
  padding: 12px;
  background-color: #039be5;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #0288d1;
}
</style>
