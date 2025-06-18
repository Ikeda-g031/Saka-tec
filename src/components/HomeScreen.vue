<!--
作成者：土田勇斗
初版作成者：土田勇斗
変更履歴：
ソース内容：時間割表のホーム画面
-->

<script setup>
import { ref } from 'vue'

// 現在の週の期間を計算
const getCurrentWeekRange = () => {
  return '5月19日 - 5月23日' // 画像に合わせて固定値
}

const weekRange = ref(getCurrentWeekRange())

// 曜日とセル数の定義
const days = ['月', '火', '水', '木', '金']
const periods = [1, 2, '昼', 3, 4, 5, 6, 7]

// サンプル授業データ（画像に基づく）
const scheduleData = ref({
  'mon-1': {
    name: 'システム論',
    room: '201F',
    color: 'blue'
  },
  'wed-1': {
    name: '英語',
    room: '303講義室',
    color: 'green'
  },
  'fri-1': {
    name: '体育',
    room: '体育館',
    color: 'orange'
  },
  'wed-3': {
    name: '数学演習',
    room: '101演習室',
    color: 'purple'
  }
})

// セルIDの生成
const getCellId = (dayIndex, period) => {
  const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri']
  return `${dayNames[dayIndex]}-${period}`
}

// セルデータの取得
const getCellData = (cellId) => {
  return scheduleData.value[cellId] || null
}

// セルの色クラス取得
const getCellColorClass = (cellData) => {
  if (!cellData) return ''
  return `cell-${cellData.color}`
}

// 週の変更（将来の機能）
const previousWeek = () => {
  console.log('前の週へ')
}

const nextWeek = () => {
  console.log('次の週へ')
}

// セルクリック処理
const onCellClick = (cellId) => {
  console.log('セルクリック:', cellId)
}
</script>

<template>
  <div class="home-screen">
    <!-- ヘッダー部分 -->
    <div class="header">
      <button class="nav-button" @click="previousWeek">
        <span class="arrow">‹</span>
      </button>
      <h1 class="week-title">{{ weekRange }}</h1>
      <button class="nav-button" @click="nextWeek">
        <span class="arrow">›</span>
      </button>
    </div>

    <!-- 時間割表 -->
    <div class="timetable">
      <!-- 曜日ヘッダー -->
      <div class="header-row">
        <div class="period-header"></div>
        <div 
          v-for="day in days" 
          :key="day"
          class="day-header"
        >
          {{ day }}
        </div>
      </div>

      <!-- 時間割の行 -->
      <div 
        v-for="period in periods" 
        :key="period"
        class="timetable-row"
      >
        <!-- 時限表示 -->
        <div class="period-cell">
          {{ period }}
        </div>

        <!-- 授業セル -->
        <div 
          v-for="(day, dayIndex) in days"
          :key="`${day}-${period}`"
          :class="['schedule-cell', getCellColorClass(getCellData(getCellId(dayIndex, period)))]"
          @click="onCellClick(getCellId(dayIndex, period))"
        >
          <div 
            v-if="getCellData(getCellId(dayIndex, period))"
            class="class-content"
          >
            <div class="class-name">
              {{ getCellData(getCellId(dayIndex, period)).name }}
            </div>
            <div class="class-room">
              {{ getCellData(getCellId(dayIndex, period)).room }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-screen {
  width: 100%;
  min-height: 100vh;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ヘッダー部分 */
.header {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  color: white;
  width: 100%;
  margin: 0;
}

.nav-button {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.arrow {
  display: block;
  line-height: 1;
}

.week-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  flex: 1;
}

/* 時間割表 */
.timetable {
  background: white;
  overflow: visible;
  width: 100%;
  flex: 1;
  margin: 0;
}

.header-row {
  display: grid;
  grid-template-columns: minmax(60px, 100px) repeat(5, 1fr);
  background: #e8f0fe;
  border-bottom: 2px solid #ddd;
  width: 100%;
}

.period-header {
  background: #d1d9e6;
  border-right: 1px solid #ccc;
}

.day-header {
  background: #d1d9e6;
  padding: 15px 8px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  border-right: 1px solid #ccc;
}

.day-header:last-child {
  border-right: none;
}

.timetable-row {
  display: grid;
  grid-template-columns: minmax(60px, 100px) repeat(5, 1fr);
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
}

.period-cell {
  background: #d1d9e6;
  padding: 20px 8px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  border-right: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.schedule-cell {
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.schedule-cell:hover {
  background-color: #f0f7ff;
}

.schedule-cell:last-child {
  border-right: none;
}

.class-content {
  text-align: center;
  padding: 8px 4px;
  width: 100%;
}

.class-name {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.3;
}

.class-room {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.3;
}

/* 色分けスタイル */
.cell-blue {
  background: linear-gradient(135deg, #cce7ff 0%, #99d6ff 100%);
  border-left: 4px solid #2196f3;
}

.cell-green {
  background: linear-gradient(135deg, #d4f0d4 0%, #a8e6a8 100%);
  border-left: 4px solid #4caf50;
}

.cell-orange {
  background: linear-gradient(135deg, #ffe4cc 0%, #ffcc99 100%);
  border-left: 4px solid #ff9800;
}

.cell-purple {
  background: linear-gradient(135deg, #e8d4f0 0%, #d1a8e6 100%);
  border-left: 4px solid #9c27b0;
}

/* 大画面用の調整 */
@media (min-width: 1200px) {
  .header-row,
  .timetable-row {
    grid-template-columns: minmax(100px, 140px) repeat(5, 1fr);
  }
  
  .period-cell {
    padding: 25px 12px;
    font-size: 1.2rem;
  }
  
  .schedule-cell {
    min-height: 90px;
    padding: 8px;
  }
  
  .class-name {
    font-size: 1.1rem;
  }
  
  .class-room {
    font-size: 0.95rem;
  }
}

/* ラップトップ用の調整 */
@media (max-width: 1199px) and (min-width: 1024px) {
  .header-row,
  .timetable-row {
    grid-template-columns: minmax(90px, 130px) repeat(5, 1fr);
  }
  
  .period-cell {
    padding: 22px 10px;
    font-size: 1.15rem;
  }
  
  .schedule-cell {
    min-height: 85px;
    padding: 6px;
  }
  
  .class-name {
    font-size: 1.05rem;
  }
  
  .class-room {
    font-size: 0.9rem;
  }
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .header {
    padding: 12px 15px;
  }
  
  .timetable {
    width: 100%;
  }
  
  .week-title {
    font-size: 1.2rem;
  }
  
  .nav-button {
    font-size: 1.5rem;
    padding: 6px 10px;
  }
  
  .header-row,
  .timetable-row {
    grid-template-columns: 60px repeat(5, 1fr);
  }
  
  .day-header {
    padding: 12px 4px;
    font-size: 1rem;
  }
  
  .period-cell {
    padding: 15px 4px;
    font-size: 1rem;
  }
  
  .schedule-cell {
    min-height: 70px;
  }
  
  .class-name {
    font-size: 0.85rem;
  }
  
  .class-room {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .week-title {
    font-size: 1rem;
  }
  
  .header-row,
  .timetable-row {
    grid-template-columns: 50px repeat(5, 1fr);
  }
  
  .day-header {
    padding: 10px 2px;
    font-size: 0.9rem;
  }
  
  .period-cell {
    padding: 12px 2px;
    font-size: 0.9rem;
  }
  
  .schedule-cell {
    min-height: 60px;
  }
  
  .class-name {
    font-size: 0.8rem;
  }
  
  .class-room {
    font-size: 0.7rem;
  }
}
</style> 