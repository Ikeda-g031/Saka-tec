<template>
  <div class="select-schedule">
    <header class="header">
      <button class="back-button" @click="goBack">
        <span class="arrow">‹</span>
      </button>
      <span class="title">予定の種類を選択</span>
    </header>
    <main class="main-content">
      <button class="schedule-btn lesson" @click="addLesson">
        授業の予定を追加
      </button>
      <button class="schedule-btn other" @click="addOther">
        授業以外の予定を追加
      </button>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goBack = () => {
  router.back()
}
const addLesson = () => {
  // 授業の予定追加画面へ遷移
  router.push('/Classinfoedit')
}
const addOther = () => {
  // 授業以外の予定追加画面へ遷移
  router.push('/jugyogai')
}
</script>

<style scoped>
.select-schedule {
  width: 100vw;
  min-height: 100vh;
  background: #fff;
}
.header {
  width: 100%;
  background: #374151;
  color: #fff;
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  box-sizing: border-box;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}
.back-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  margin-right: 12px;
  cursor: pointer;
  padding: 4px 8px;
}
.arrow {
  font-size: 1.5rem;
  vertical-align: middle;
}
.title {
  flex: 1;
  font-size: 1.2rem;
  font-weight: 600;
}
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
}
.schedule-btn {
  width: 350px;
  max-width: 90vw;
  padding: 22px 0;
  margin-bottom: 28px;
  border: none;
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: box-shadow 0.2s, background 0.2s;
}
.schedule-btn.lesson {
  background: #03a9f4;
  color: #fff;
}
.schedule-btn.lesson:hover {
  background: #0288d1;
}
.schedule-btn.other {
  background: #1cc7a7;
  color: #fff;
}
.schedule-btn.other:hover {
  background: #009e7f;
}
</style>
