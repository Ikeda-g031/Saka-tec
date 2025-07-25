<!--
作成者：本間遥人
初版作成者：本間遥人
変更履歴：
6/21 22:52
ソース内容：追加する授業以外の予定を書き加える画面
7/7 22:00 土田勇斗
ローカルDBの追加
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
      <!-- 必須項目の説明 -->
      <div class="required-notice">
        <span class="required-mark">*</span> は必須項目です
      </div>
      
      <form @submit.prevent="submitForm" class="form-content">
        <!-- タイトル -->
        <div class="form-group required">
          <label class="form-label">予定のタイトル <span class="required-mark">*</span></label>
          <input
            type="text"
            v-model="title"
            placeholder="例: サークルのミーティング"
            class="form-input"
            maxlength="50"
            required
          />
        </div>
        <!-- 日時 -->
        <div class="form-group required">
          <label class="form-label">日時 <span class="required-mark">*</span></label>
          <div class="time-selector">
            <select v-model="selectedDay" class="form-select time-select" required>
              <option value="0">月曜日</option>
              <option value="1">火曜日</option>
              <option value="2">水曜日</option>
              <option value="3">木曜日</option>
              <option value="4">金曜日</option>
            </select>
            <select v-model="selectedPeriod" class="form-select time-select" required>
              <option value="1">1限</option>
              <option value="2">2限</option>
              <option value="lunch">昼</option>
              <option value="3">3限</option>
              <option value="4">4限</option>
              <option value="5">5限</option>
              <option value="6">6限</option>
              <option value="7">7限</option>
            </select>
          </div>
        </div>
        <!-- 詳細・メモ -->
        <div class="form-group">
          <label class="form-label">詳細・メモ</label>
          <textarea
            v-model="memo"
            placeholder="場所や内容など"
            class="form-textarea"
            maxlength="500"
          ></textarea>
        </div>

        <!-- 繰り返し設定 -->
        <div class="form-group">
          <label class="form-label">繰り返し設定</label>
          <select v-model="repeat" class="form-select">
                      <option value="none">繰り返さない</option>
          <option value="weekly">毎週</option>
          </select>
        </div>
        
        <!-- 繰り返し終了条件 -->
        <div v-if="repeat !== 'none'" class="form-group">
          <label class="form-label">繰り返し終了条件</label>
          <select v-model="repeatEndType" class="form-select">
            <option value="never">終了しない</option>
            <option value="date">指定日まで</option>
            <option value="count">指定回数まで</option>
          </select>
        </div>
        
        <!-- 終了日設定 -->
        <div v-if="repeat !== 'none' && repeatEndType === 'date'" class="form-group">
          <label class="form-label">終了日</label>
          <input
            type="date"
            v-model="repeatEndDate"
            class="form-input"
          />
        </div>
        
        <!-- 繰り返し回数設定 -->
        <div v-if="repeat !== 'none' && repeatEndType === 'count'" class="form-group">
          <label class="form-label">繰り返し回数</label>
          <input
            type="number"
            v-model="repeatCount"
            placeholder="例: 10"
            class="form-input"
            min="1"
            max="100"
          />
        </div>

        <!-- 固定の保存ボタンエリア -->
        <div class="fixed-button-area">
          <button type="submit" class="submit-button" @click="submitForm">
            決定
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { timetableService } from '../services/database.js'

const router = useRouter()
const route = useRoute()

const title = ref('')
const memo = ref('')
const repeat = ref('weekly')
const repeatEndType = ref('never')
const repeatEndDate = ref('')
const repeatCount = ref(1)

// 曜日と時限の選択用（初期値をクエリパラメータから取得）
const selectedDay = ref(parseInt(route.query.day) || 0) // 0=月, 1=火, 2=水, 3=木, 4=金
const selectedPeriod = ref(route.query.period === 'lunch' ? 'lunch' : (parseInt(route.query.period) || 1)) // 1-7限 or 'lunch'

// 週情報を取得
const weekStart = ref(route.query.weekStart ? new Date(route.query.weekStart) : null)

const goBack = () => {
  router.back()
}

const submitForm = async () => {
  // 必須項目のバリデーション（先頭と末尾のスペースのみ削除）
  if (!title.value.trim()) {
    alert('予定のタイトルを入力してください。');
    return;
  }
  
  if (selectedDay.value === null || selectedPeriod.value === null) {
    alert('日時を選択してください。');
    return;
  }
  
  try {
    // データベース用のデータ形式に変換（先頭と末尾のスペースのみ削除）
    const eventData = {
      name: title.value.trim(),
      room: '', // 授業以外の予定では教室は空
      day: parseInt(selectedDay.value),
      period: selectedPeriod.value === 'lunch' ? 'lunch' : parseInt(selectedPeriod.value),
      color: 'orange', // 授業以外の予定は固定色
      teacher: '', // 授業以外の予定では教員は空
      note: memo.value.trim(),
      // 追加情報
      credits: 0, // 授業以外の予定では単位数は0
      syllabusUrl: '',
      repeat: repeat.value || 'weekly',
      repeatEndType: repeatEndType.value || 'never',
      repeatEndDate: repeatEndDate.value || '',
      repeatCount: repeatCount.value || 1,
      notification: '',
      isEvent: true // 授業以外の予定であることを示すフラグ
    };

    // データベースに保存
    await timetableService.addClass(eventData, weekStart.value);
    
    console.log('登録された予定:', eventData);
    alert('予定を保存しました！');
    
    // ホーム画面に戻る（週情報を引き継ぐ）
    if (weekStart.value) {
      router.push({
        path: '/',
        query: { weekStart: weekStart.value.toISOString() }
      });
    } else {
      router.push('/');
    }
    
  } catch (error) {
    console.error('保存エラー:', error);
    alert('保存に失敗しました。もう一度お試しください。');
  }
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

/* 固定ボタンエリアのスタイル */
.fixed-button-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f8f9fa;
  padding: 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
  box-sizing: border-box;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.submit-button {
  margin-top: 0px;
  width: 100%;
  padding: 8px;
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

.time-selector {
  display: flex;
  gap: 10px;
}

.time-select {
  flex: 1;
}

/* 必須項目のスタイル */
.required-notice {
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #495057;
}

.required-mark {
  color: #dc3545;
  font-weight: bold;
}

.form-group.required .form-label {
  color: #495057;
  font-weight: 600;
}

.form-group.required .form-input,
.form-group.required .form-select {
  border-color: #007bff;
}

.form-group.required .form-input:focus,
.form-group.required .form-select:focus {
  border-color: #0056b3;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
