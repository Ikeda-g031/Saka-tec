<!--
作成者：土田勇斗
初版作成者：土田勇斗
変更履歴：
6/21 22:47
本間遥人
Jugyougai.vueへ移動できるよう15行目-21行目、101行目-104行目を追加
ソース内容：時間割表のホーム画面
7/7 22:00 土田勇斗
ローカルDBの追加
-->

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { timetableService } from '../services/database.js'

// 画面遷移
const router = useRouter()

// SelectSchedule.vueへ移動
const goToSelectSchedule = (day = null, period = null) => {
  // 曜日・時限情報をクエリパラメータで渡す
  const query = {}
  if (day !== null) query.day = day
  if (period !== null) {
    // 昼の場合は特別な値として'lunch'を渡す
    query.period = period === 'lunch' ? 'lunch' : period
  }
  
  router.push({
    path: '/SelectSchedule',
    query: query
  })
}

// ClassDetailViewScreen.vueへ移動
const goToClassDetailViewScreen = (classId = null) => {
  if (classId) {
    router.push({
      path: '/ClassDetailViewScreen',
      query: { id: classId }
    })
  } else {
    router.push('/ClassDetailViewScreen')
  }
}

// 現在の週の期間を計算
const getCurrentWeekRange = () => {
  return '5月19日 - 5月23日'
}

const weekRange = ref(getCurrentWeekRange())

// 曜日とセル数の定義
const days = ['月', '火', '水', '木', '金']
const periods = [1, 2, '昼', 3, 4, 5, 6, 7]

// 時間割データ（データベースから取得）
const scheduleData = ref({})

// データベースから時間割データを読み込み
const loadScheduleData = async () => {
  try {
    scheduleData.value = await timetableService.getScheduleData()
  } catch (error) {
    console.error('データ読み込みエラー:', error)
  }
}

// サンプルデータを追加する関数（初回のみ）
const addSampleData = async () => {
  try {
    // 既存データをチェック
    const existingClasses = await timetableService.getAllClasses()
    if (existingClasses.length > 0) {
      return // 既にデータがある場合は追加しない
    }
    
    // サンプルデータを追加
    const sampleClasses = [
      {
        name: 'システム論',
        room: '201F',
        day: 0, // 月曜日
        period: 1,
        color: 'blue',
        teacher: '田中先生',
        note: ''
      },
      {
        name: '英語',
        room: '303講義室',
        day: 2, // 水曜日
        period: 1,
        color: 'green',
        teacher: '佐藤先生',
        note: ''
      },
      {
        name: '体育',
        room: '体育館',
        day: 4, // 金曜日
        period: 1,
        color: 'orange',
        teacher: '山田先生',
        note: ''
      },
      {
        name: '数学演習',
        room: '101演習室',
        day: 2, // 水曜日
        period: 3,
        color: 'purple',
        teacher: '鈴木先生',
        note: ''
      }
    ]
    
    for (const classData of sampleClasses) {
      await timetableService.addClass(classData)
    }
    
    // データを再読み込み
    await loadScheduleData()
  } catch (error) {
    console.error('サンプルデータ追加エラー:', error)
  }
}

// コンポーネントマウント時の処理
onMounted(async () => {
  await addSampleData()
  await loadScheduleData()
})

// 画面が再度表示された時の処理（新しい授業が追加された後など）
onActivated(async () => {
  await loadScheduleData()
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
  const cell = getCellData(cellId)
  if (cell) {
    // 空でないセルの場合、ClassDatailViewScreen.vueへ遷移（授業IDを渡す）
    goToClassDetailViewScreen(cell.id)
  } else {
    // 空セルの場合は予定追加画面へ（曜日・時限情報を渡す）
    const { day, period } = parseCellId(cellId)
    goToSelectSchedule(day, period)
  }
}

// セルIDから曜日と時限を解析する関数
const parseCellId = (cellId) => {
  const dayMap = {
    'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3, 'fri': 4
  }
  
  const [dayName, period] = cellId.split('-')
  const day = dayMap[dayName] || 0
  const periodNum = period === '昼' ? 'lunch' : parseInt(period)
  
  return { day, period: periodNum }
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
  background-color: transparent;
  display: block;
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
  padding: 15px 10px;
  color: white;
  width: 100%;
  margin: 0;
  min-height: 60px;
}

.nav-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.arrow {
  display: block;
  line-height: 1;
}

.week-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 時間割表 */
.timetable {
  background: white;
  overflow: visible;
  width: 100%;
  margin: 0;
}

.header-row {
  display: grid;
  grid-template-columns: minmax(60px, 80px) repeat(5, 1fr);
  background: #e8f0fe;
  border-bottom: 2px solid #ddd;
  width: 100%;
}

.period-header {
  background: #d1d9e6;
  border-right: 1px solid #ccc;
  min-height: 50px;
}

.day-header {
  background: #d1d9e6;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  border-right: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-header:last-child {
  border-right: none;
}

.timetable-row {
  display: grid;
  grid-template-columns: minmax(60px, 80px) repeat(5, 1fr);
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
}

.period-cell {
  background: #d1d9e6;
  padding: 15px 8px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  border-right: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70px;
}

.schedule-cell {
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 70px;
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
  padding: 6px 4px;
  width: 100%;
}

.class-name {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.2;
}

.class-room {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.2;
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

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .header {
    padding: 12px 5px;
    min-height: 50px;
  }

  .week-title {
    font-size: 1.1rem;
  }

  .nav-button {
    font-size: 1.5rem;
    padding: 6px 8px;
  }

  .header-row,
  .timetable-row {
    grid-template-columns: minmax(35px, 50px) repeat(5, 1fr);
  }

  .day-header {
    padding: 10px 1px;
    font-size: 0.9rem;
  }

  .period-cell {
    padding: 12px 1px;
    font-size: 0.9rem;
    min-height: 60px;
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

@media (max-width: 480px) {
  .header {
    padding: 10px 3px;
  }

  .week-title {
    font-size: 1rem;
  }

  .header-row,
  .timetable-row {
    grid-template-columns: minmax(30px, 40px) repeat(5, 1fr);
  }

  .day-header {
    padding: 8px 1px;
    font-size: 0.8rem;
  }

  .period-cell {
    padding: 10px 1px;
    font-size: 0.8rem;
    min-height: 50px;
  }

  .schedule-cell {
    min-height: 50px;
  }

  .class-name {
    font-size: 0.75rem;
  }

  .class-room {
    font-size: 0.65rem;
  }
}

/* 大画面用の調整 */
@media (min-width: 1200px) {
  .header-row,
  .timetable-row {
    grid-template-columns: minmax(100px, 150px) repeat(5, 1fr);
  }

  .period-cell {
    padding: 20px 12px;
    font-size: 1.2rem;
    min-height: 80px;
  }

  .schedule-cell {
    min-height: 80px;
  }

  .class-name {
    font-size: 1.1rem;
  }

  .class-room {
    font-size: 1rem;
  }
}

</style>
