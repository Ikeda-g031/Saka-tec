<template>
  <div class="wrapper">
    <div class="form-container">
      <h2>授業情報を編集</h2>
      <form @submit.prevent="submitForm">
        <label>授業名 <input v-model="form.title" /></label>
        <label>教員名 <input v-model="form.instructor" /></label>
        <label>単位数 <input v-model="form.units" type="number" /></label>
        <label>開講期間 <input v-model="form.period" /></label>
        <label>教室 <input v-model="form.classroom" /></label>
        <label>シラバスURL <input v-model="form.syllabusUrl" /></label>
        <label>授業概要/備考 <textarea v-model="form.notes" rows="3"></textarea></label>
        <label>セルの色
          <select v-model="form.cellColor">
            <option>スカイブルー</option>
            <option>グリーン</option>
            <option>ピンク</option>
          </select>
        </label>
        <label>繰り返し設定
          <select v-model="form.repeatSetting">
            <option>毎週</option>
            <option>隔週</option>
            <option>なし</option>
          </select>
        </label>
        <button type="submit">保存する</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  title: '',
  instructor: '',
  units: '',
  period: '',
  classroom: '',
  syllabusUrl: '',
  notes: '',
  cellColor: '',
  repeatSetting: ''
})

function submitForm() {
  console.log('Form submitted:', form)
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f7f9fc;
}

.form-container {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center; /* テキスト中央ぞろえ */
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  text-align: left; /* ラベル名は左寄せにしたい場合は left に変更 */
}

input, textarea, select, button {
  padding: 6px;
  font-size: 14px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}
</style>
