import React, { useState } from 'react';

export default function CourseForm() {
  const [formData, setFormData] = useState({
    courseName: '',
    teacherName: '',
    credits: 2,
    term: '',
    classroom: '',
    syllabusUrl: '',
    notes: '',
    cellColor: 'skyblue',
    repeat: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // ここをAPI送信などに変更可能
    alert('保存しました');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">授業情報を編集</h2>

      <label className="block mb-2">授業名</label>
      <input name="courseName" onChange={handleChange} className="w-full p-2 border mb-4" />

      <label className="block mb-2">教員名</label>
      <input name="teacherName" onChange={handleChange} className="w-full p-2 border mb-4" />

      <label className="block mb-2">単位数</label>
      <input name="credits" type="number" onChange={handleChange} className="w-full p-2 border mb-4" />

      <label className="block mb-2">開講期間</label>
      <input name="term" onChange={handleChange} className="w-full p-2 border mb-4" />

      <label className="block mb-2">教室</label>
      <input name="classroom" onChange={handleChange} className="w-full p-2 border mb-4" />

      <label className="block mb-2">シラバスURL</label>
      <input name="syllabusUrl" type="url" onChange={handleChange} className="w-full p-2 border mb-4" />

      <label className="block mb-2">授業概要/備考</label>
      <textarea name="notes" rows="3" onChange={handleChange} className="w-full p-2 border mb-4" />

      <label className="block mb-2">セルの色</label>
      <select name="cellColor" onChange={handleChange} className="w-full p-2 border mb-4">
        <option value="skyblue">スカイブルー</option>
        <option value="lightgreen">ライトグリーン</option>
        <option value="lightyellow">ライトイエロー</option>
      </select>

      <label className="block mb-2">繰り返し設定</label>
      <select name="repeat" onChange={handleChange} className="w-full p-2 border mb-6">
        <option value="なし">なし</option>
        <option value="毎週">毎週</option>
        <option value="隔週">隔週</option>
      </select>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        保存する
      </button>
    </form>
  );
}
