<!--
作成者：池田葉留
初版作成者：池田葉留
変更履歴：
6/22 22:43
授業名、教員名、単位数、開講時期、教室等の入力フォームを提供
7/7 22:00 土田勇斗
ローカルDBの追加
-->

<template>
  <div class="classinfoedit-screen">
    <!-- ヘッダー -->
    <div class="header">
      <button class="nav-button" @click="goBack">
        <span class="arrow">‹</span>
      </button>
      <h1 class="header-title">{{ isEditMode ? '授業情報を編集' : '新規授業情報を入力' }}</h1>
    </div>

    <!-- 入力フォーム -->
    <div class="form-container">
      <!-- 必須項目の説明 -->
      <div class="required-notice">
        <span class="required-mark">*</span> は必須項目です
      </div>
      
      <form @submit.prevent="submitForm" class="form-content">
        <!-- 授業名 -->
        <div class="form-group required">
          <label class="form-label">授業名 <span class="required-mark">*</span></label>
          <input
            type="text"
            v-model="courseName"
            placeholder="例: 情報基礎"
            class="form-input"
            maxlength="50"
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
            maxlength="50"
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
          />
        </div>
        <!-- 開講時期 -->
        <div class="form-group required">
          <label class="form-label">開講時期 <span class="required-mark">*</span></label>
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
        <!-- 教室 -->
        <div class="form-group">
          <label class="form-label">教室</label>
          <input
            type="text"
            v-model="classroom"
            placeholder="例: 201F"
            class="form-input"
            maxlength="20"
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
            maxlength="500"
          />
        </div>
        <!-- 授業概要/備考 -->
        <div class="form-group">
          <label class="form-label">授業概要/備考</label>
          <textarea
            v-model="notes"
            placeholder="持ち物やメモなど"
            class="form-textarea"
            maxlength="1000"
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
            maxlength="100"
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
          {{ isEditMode ? '更新する' : '保存する' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { timetableService } from '../services/database.js'

const router = useRouter()
const route = useRoute()

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

// 編集モードかどうか
const isEditMode = ref(route.query.edit === 'true')
const editingClassId = ref(route.query.id ? parseInt(route.query.id) : null)

// 曜日と時限の選択用（初期値をクエリパラメータから取得）
const selectedDay = ref(parseInt(route.query.day) || 0) // 0=月, 1=火, 2=水, 3=木, 4=金
const selectedPeriod = ref(route.query.period === 'lunch' ? 'lunch' : (parseInt(route.query.period) || 1)) // 1-7限 or 'lunch'

// 編集時のデータ読み込み
const loadEditData = async () => {
  if (isEditMode.value && editingClassId.value) {
    try {
      const classes = await timetableService.getAllClasses()
      const classData = classes.find(c => c.id === editingClassId.value)
      if (classData) {
        courseName.value = classData.name || ''
        teacherName.value = classData.teacher || ''
        credits.value = classData.credits || ''
        classroom.value = classData.room || ''
        syllabusUrl.value = classData.syllabusUrl || ''
        notes.value = classData.note || ''
        selectedDay.value = classData.day || 0
        selectedPeriod.value = classData.period || 1
        repeat.value = classData.repeat || ''
        notification.value = classData.notification || '10分前'
        
        // 色の変換
        const colorMap = {
          'blue': 'skyblue',
          'green': 'lightgreen',
          'orange': 'lightyellow'
        }
        cellColor.value = colorMap[classData.color] || 'skyblue'
      }
    } catch (error) {
      console.error('編集データ読み込みエラー:', error)
    }
  }
}

// コンポーネントマウント時の処理
onMounted(async () => {
  await loadEditData()
})

const goBack = () => {
  router.back()
}

// 曜日と時限を解析する関数
const parseTermInput = (termInput) => {
  const dayMap = {
    '月': 0, '火': 1, '水': 2, '木': 3, '金': 4,
    'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3, 'fri': 4
  }
  
  // "火曜 1限" のような形式を解析
  const dayMatch = termInput.match(/([月火水木金])/);
  const periodMatch = termInput.match(/(\d+)限/);
  
  let day = 0;
  let period = 1;
  
  if (dayMatch) {
    day = dayMap[dayMatch[1]] || 0;
  }
  
  if (periodMatch) {
    period = parseInt(periodMatch[1]) || 1;
  }
  
  return { day, period };
}

// 色の変換関数
const convertColor = (colorName) => {
  const colorMap = {
    'skyblue': 'blue',
    'lightgreen': 'green',
    'lightyellow': 'orange'
  };
  return colorMap[colorName] || 'blue';
}

const submitForm = async () => {
  // 必須項目のバリデーション
  if (!courseName.value.trim()) {
    alert('授業名を入力してください。');
    return;
  }
  
  if (selectedDay.value === null || selectedPeriod.value === null) {
    alert('開講時期を選択してください。');
    return;
  }
  
  try {
    // データベース用のデータ形式に変換
    const classData = {
      name: courseName.value.trim(),
      room: classroom.value || '',
      day: parseInt(selectedDay.value),
      period: selectedPeriod.value === 'lunch' ? 'lunch' : parseInt(selectedPeriod.value),
      color: convertColor(cellColor.value),
      teacher: teacherName.value || '',
      note: notes.value || '',
      // 追加情報
      credits: credits.value || 0,
      syllabusUrl: syllabusUrl.value || '',
      repeat: repeat.value || '',
      notification: notification.value || ''
    };

    if (isEditMode.value && editingClassId.value) {
      // 編集モード：既存データを更新
      await timetableService.updateClass(editingClassId.value, classData);
      console.log('更新された授業情報:', classData);
      alert('授業情報を更新しました！');
    } else {
      // 新規作成モード：新しいデータを追加
      await timetableService.addClass(classData);
      console.log('登録された授業情報:', classData);
      alert('授業情報を保存しました！');
    }
    
    // ホーム画面に戻る
    router.push('/');
    
  } catch (error) {
    console.error('保存エラー:', error);
    alert('保存に失敗しました。もう一度お試しください。');
  }
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
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
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
