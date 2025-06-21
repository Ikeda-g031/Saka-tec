<!--
作成者：本間遥人
初版作成者：本間遥人
変更履歴：
6/21 22:52
ソース内容：追加する授業以外の予定を書き加える画面
-->

<template>
  <div class="jugyogai-screen">
    <!-- ヘッダー -->
    <div class="header">
      <button class="nav-button" @click="goBack">
        <span class="arrow">‹</span>
      </button>
      <h1 class="header-title">予定を入力</h1>
    </div>

    <!-- 入力フォーム -->
    <div class="form-container">
      <form @submit.prevent="submitForm" class="form-content">
        <!-- タイトル -->
        <div class="form-group">
          <label class="form-label">予定のタイトル</label>
          <input
            type="text"
            v-model="title"
            placeholder="例: サークルのミーティング"
            class="form-input"
            required
          />
        </div>

        <!-- 詳細・メモ -->
        <div class="form-group">
          <label class="form-label">詳細・メモ</label>
          <textarea
            v-model="memo"
            placeholder="場所や内容など"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- 日時 -->
        <div class="form-group">
          <label class="form-label">日時</label>
          <input
            type="datetime-local"
            v-model="datetime"
            class="form-input"
            required
          />
        </div>

        <!-- 繰り返し設定 -->
        <div class="form-group">
          <label class="form-label">繰り返し設定</label>
          <select v-model="repeat" class="form-select">
            <option value="none">繰り返さない</option>
            <option value="weekly">毎週</option>
            <option value="monthly">毎月</option>
          </select>
        </div>

        <!-- 決定ボタン -->
        <button type="submit" class="submit-button">
          決定
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const memo = ref('')
const datetime = ref('')
const repeat = ref('none')

const goBack = () => {
  router.back()
}

const submitForm = () => {
  const eventData = {
    title: title.value,
    memo: memo.value,
    datetime: datetime.value,
    repeat: repeat.value
  }

  console.log('登録された予定:', eventData)

  router.push('/')
}
</script>

<style scoped>
.jugyogai-screen {
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
  background-color: #28a745;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #218838;
}
</style>
