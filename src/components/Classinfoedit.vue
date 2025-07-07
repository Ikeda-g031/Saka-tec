<template>
  <form @submit="handleSubmit" class="max-w-xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4">授業情報を編集</h2>

    <label class="block mb-2">授業名</label>
    <input v-model="formData.courseName" name="courseName" class="w-full p-2 border mb-4" />

    <label class="block mb-2">教員名</label>
    <input v-model="formData.teacherName" name="teacherName" class="w-full p-2 border mb-4" />

    <label class="block mb-2">単位数</label>
    <input v-model.number="formData.credits" name="credits" type="number" class="w-full p-2 border mb-4" />

    <label class="block mb-2">開講期間</label>
    <input v-model="formData.term" name="term" class="w-full p-2 border mb-4" />

    <label class="block mb-2">教室</label>
    <input v-model="formData.classroom" name="classroom" class="w-full p-2 border mb-4" />

    <label class="block mb-2">シラバスURL</label>
    <input v-model="formData.syllabusUrl" name="syllabusUrl" type="url" class="w-full p-2 border mb-4" />

    <label class="block mb-2">授業概要/備考</label>
    <textarea v-model="formData.notes" name="notes" rows="3" class="w-full p-2 border mb-4" />

    <label class="block mb-2">セルの色</label>
    <select v-model="formData.cellColor" name="cellColor" class="w-full p-2 border mb-4">
      <option value="skyblue">スカイブルー</option>
      <option value="lightgreen">ライトグリーン</option>
      <option value="lightyellow">ライトイエロー</option>
    </select>

    <label class="block mb-2">繰り返し設定</label>
    <select v-model="formData.repeat" name="repeat" class="w-full p-2 border mb-6">
      <option value="なし">なし</option>
      <option value="毎週">毎週</option>
      <option value="隔週">隔週</option>
    </select>

    <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
      保存する
    </button>
  </form>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'CourseForm',
  setup() {
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
      console.log(formData.value) // ここをAPI送信などに変更可能
      alert('保存しました')
    }

    return {
      formData,
      handleSubmit
    }
  }
}
</script>

<style scoped>
/* TailwindCSSクラスがそのまま使用可能です */
</style>
