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

// 週の開始日を月曜日に設定する関数
const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 月曜日を週の開始とする
  return new Date(d.setDate(diff))
}

// 現在の週の期間を計算
const getCurrentWeekRange = () => {
  const weekStart = currentWeekStart.value
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 4) // 金曜日まで
  
  const formatDate = (date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
  
  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
}

// 曜日とセル数の定義
const days = ['月', '火', '水', '木', '金']

// 時限の定義（表示用と内部処理用）
const periodData = [
  { title: '1限', time: '8:50〜', value: 1 },
  { title: '2限', time: '10:30〜', value: 2 },
  { title: '昼', time: '12:00〜', value: '昼' },
  { title: '3限', time: '13:00〜', value: 3 },
  { title: '4限', time: '14:40〜', value: 4 },
  { title: '5限', time: '16:20〜', value: 5 },
  { title: '6限', time: '18:00〜', value: 6 },
  { title: '7限', time: '19:40〜', value: 7 }
]

// 現在の週の基準日を管理
const currentWeekStart = ref(getWeekStart(new Date()))
const weekRange = ref(getCurrentWeekRange())

// 現在の週の各日付を取得する関数
const getWeekDates = () => {
  const weekStart = currentWeekStart.value
  const dates = []
  
  for (let i = 0; i < 5; i++) { // 月曜日から金曜日まで
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    dates.push({
      day: days[i],
      date: date,
      formatted: `${date.getMonth() + 1}/${date.getDate()}`
    })
  }
  
  return dates
}

// 現在の週の日付配列
const weekDates = ref([])

// 時間割データ（データベースから取得）
const scheduleData = ref({})

// データベースから時間割データを読み込み
const loadScheduleData = async () => {
  try {
    scheduleData.value = await timetableService.getScheduleData(currentWeekStart.value)
    console.log('読み込まれたスケジュールデータ:', scheduleData.value)
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
  // 現在の週を初期化
  currentWeekStart.value = getWeekStart(new Date())
  weekRange.value = getCurrentWeekRange()
  weekDates.value = getWeekDates()
  
  // データの整合性チェック・クリーンアップ
  try {
    const cleanedCount = await timetableService.cleanupDuplicateData()
    if (cleanedCount > 0) {
      console.log(`${cleanedCount}件の重複データを削除しました`)
    }
  } catch (error) {
    console.error('データクリーンアップエラー:', error)
  }
  
  await addSampleData()
  await loadScheduleData()
})

// 画面が再度表示された時の処理（新しい授業が追加された後など）
onActivated(async () => {
  await loadScheduleData()
})

// セルIDの生成
const getCellId = (dayIndex, periodIndex) => {
  const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri']
  const periodValue = periodData[periodIndex].value
  return `${dayNames[dayIndex]}-${periodValue}`
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

// 週の変更機能
const previousWeek = async () => {
  // 現在の週の開始日から7日前に移動
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
  
  // 表示を更新
  weekRange.value = getCurrentWeekRange()
  weekDates.value = getWeekDates()
  
  // スケジュールデータを再読み込み
  await loadScheduleData()
  
  console.log('前の週へ移動:', weekRange.value)
}

const nextWeek = async () => {
  // 現在の週の開始日から7日後に移動
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
  
  // 表示を更新
  weekRange.value = getCurrentWeekRange()
  weekDates.value = getWeekDates()
  
  // スケジュールデータを再読み込み
  await loadScheduleData()
  
  console.log('次の週へ移動:', weekRange.value)
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
          v-for="(dateInfo, index) in weekDates"
          :key="index"
          class="day-header"
        >
          <div class="day-name">{{ dateInfo.day }}</div>
          <div class="day-date">{{ dateInfo.formatted }}</div>
        </div>
      </div>

      <!-- 時間割の行 -->
      <div
        v-for="(periodInfo, periodIndex) in periodData"
        :key="periodInfo.value"
        class="timetable-row"
      >
        <!-- 時限表示 -->
        <div class="period-cell">
          <div class="period-title">{{ periodInfo.title }}</div>
          <div class="period-time">{{ periodInfo.time }}</div>
        </div>

        <!-- 授業セル -->
        <div
          v-for="(day, dayIndex) in days"
          :key="`${day}-${periodInfo.value}`"
          :class="['schedule-cell', getCellColorClass(getCellData(getCellId(dayIndex, periodIndex)))]"
          @click="onCellClick(getCellId(dayIndex, periodIndex))"
        >
          <div
            v-if="getCellData(getCellId(dayIndex, periodIndex))"
            class="class-content"
          >
            <div class="class-name">
              {{ getCellData(getCellId(dayIndex, periodIndex)).name }}
            </div>
            <div class="class-room">
              {{ getCellData(getCellId(dayIndex, periodIndex)).room }}
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
  padding: 8px 4px;
  text-align: center;
  font-weight: 600;
  color: #333;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.day-name {
  font-size: 1.1rem;
  margin-bottom: 2px;
}

.day-date {
  font-size: 0.8rem;
  font-weight: 400;
  color: #666;
}

.day-header:last-child {
  border-right: none;
}

.timetable-row {
  display: grid;
  grid-template-columns: minmax(120px, 150px) repeat(5, 1fr);
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
}

.period-cell {
  background: #d1d9e6;
  padding: 8px 4px;
  text-align: center;
  color: #333;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70px;
  line-height: 1.2;
}

.period-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 2px;
}

.period-time {
  font-weight: 400;
  font-size: 0.75rem;
  color: #666;
  opacity: 0.8;
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
  white-space: pre-wrap; /* 追加 */
}

.class-room {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.2;
  white-space: pre-wrap; /* 追加 */
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

.cell-red {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-left: 4px solid #f44336;
}

.cell-yellow {
  background: linear-gradient(135deg, #fffde7 0%, #fff9c4 100%);
  border-left: 4px solid #ffeb3b;
}

.cell-pink {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  border-left: 4px solid #e91e63;
}

.cell-indigo {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
  border-left: 4px solid #3f51b5;
}

.cell-gray {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-left: 4px solid #9e9e9e;
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
    grid-template-columns: minmax(80px, 100px) repeat(5, 1fr);
  }

  .day-header {
    padding: 6px 1px;
  }

  .day-name {
    font-size: 0.9rem;
    margin-bottom: 1px;
  }

  .day-date {
    font-size: 0.7rem;
  }

  .period-cell {
    padding: 6px 2px;
    min-height: 60px;
  }

  .period-title {
    font-size: 0.9rem;
    margin-bottom: 1px;
  }

  .period-time {
    font-size: 0.65rem;
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
    grid-template-columns: minmax(60px, 80px) repeat(5, 1fr);
  }

  .day-header {
    padding: 4px 1px;
  }

  .day-name {
    font-size: 0.8rem;
    margin-bottom: 1px;
  }

  .day-date {
    font-size: 0.6rem;
  }

  .period-cell {
    padding: 4px 1px;
    min-height: 50px;
  }

  .period-title {
    font-size: 0.8rem;
    margin-bottom: 1px;
  }

  .period-time {
    font-size: 0.6rem;
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
    padding: 12px 8px;
    min-height: 80px;
  }

  .period-title {
    font-size: 1.2rem;
    margin-bottom: 3px;
  }

  .period-time {
    font-size: 0.9rem;
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
