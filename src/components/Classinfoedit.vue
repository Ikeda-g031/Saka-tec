<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <form @submit="handleSubmit" class="w-full max-w-2xl bg-white rounded shadow-md p-6">
      <!-- ヘッダー -->
      <div class="bg-gray-700 text-white text-lg font-semibold rounded-t px-4 py-3 mb-6">
        授業情報を編集
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">授業名</label>
        <input v-model="formData.courseName" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">教員名</label>
        <input v-model="formData.teacherName" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">単位数</label>
        <input v-model.number="formData.credits" type="number" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">開講期間</label>
        <input v-model="formData.term" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">教室</label>
        <input v-model="formData.classroom" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">シラバスURL</label>
        <input v-model="formData.syllabusUrl" type="url" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">授業概要/備考</label>
        <textarea v-model="formData.notes" rows="3" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">セルの色</label>
        <select v-model="formData.cellColor" class="w-full p-2 border rounded">
          <option value="skyblue">スカイブルー</option>
          <option value="lightgreen">ライトグリーン</option>
          <option value="lightyellow">ライトイエロー</option>
        </select>
      </div>

      <div class="mb-6">
        <label class="block mb-1 text-sm font-medium">繰り返し設定</label>
        <select v-model="formData.repeat" class="w-full p-2 border rounded">
          <option value="なし">なし</option>
          <option value="毎週">毎週</option>
          <option value="隔週">隔週</option>
        </select>
      </div>

      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
        保存する
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  courseName: '',
  teacherName: '',
  credits: 2,
  term: '',
  classroom: '',
  syllabusUrl: '',
  notes: '',
  cellColor: 'skyblue',
  repeat: '',
})

const handleSubmit = (e) => {
  e.preventDefault()
  console.log(formData.value)
  alert('保存しました')
}
</script>

<style scoped>
/* 追加で調整したい場合はここに書けます */
</style>
