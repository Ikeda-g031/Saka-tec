/*
作成者：土田勇斗
初版作成者：土田勇斗
変更履歴：
7/7 21:52
授業データのCRUD操作、時間割データの取得、データのエクスポート・インポート機能を提供
*/
import Dexie from 'dexie';

export class TimetableDatabase extends Dexie {
  constructor() {
    super('TimetableDB');
    
    // データベーススキーマを定義
    this.version(1).stores({
      // 授業データテーブル
      classes: '++id, name, room, day, period, color, teacher, note, createdAt, updatedAt',
      
      // 設定テーブル
      settings: '++id, key, value',
      
      // 週データテーブル（将来の拡張用）
      weeks: '++id, startDate, endDate, isActive'
    });
  }
}

// データベースインスタンスを作成
export const db = new TimetableDatabase();

// データベースサービスクラス
export class TimetableService {
  
  // 授業を追加
  async addClass(classData) {
    const now = new Date();
    const classWithTimestamp = {
      ...classData,
      createdAt: now,
      updatedAt: now
    };
    
    return await db.classes.add(classWithTimestamp);
  }
  
  // 授業を更新
  async updateClass(id, classData) {
    const updatedData = {
      ...classData,
      updatedAt: new Date()
    };
    
    return await db.classes.update(id, updatedData);
  }
  
  // 授業を削除
  async deleteClass(id) {
    return await db.classes.delete(id);
  }
  
  // 全授業を取得
  async getAllClasses() {
    return await db.classes.toArray();
  }
  
  // 特定の曜日・時限の授業を取得
  async getClassByDayAndPeriod(day, period) {
    return await db.classes
      .where({ day: day, period: period })
      .first();
  }
  
  // 時間割形式のデータを取得
  async getScheduleData() {
    const classes = await this.getAllClasses();
    const scheduleData = {};
    
    // 曜日マッピング
    const dayMap = {
      0: 'mon', 1: 'tue', 2: 'wed', 3: 'thu', 4: 'fri'
    };
    
    classes.forEach(classItem => {
      const cellId = `${dayMap[classItem.day]}-${classItem.period}`;
      scheduleData[cellId] = {
        id: classItem.id,
        name: classItem.name,
        room: classItem.room,
        color: classItem.color,
        teacher: classItem.teacher,
        note: classItem.note
      };
    });
    
    return scheduleData;
  }
  
  // データをエクスポート
  async exportData() {
    const classes = await this.getAllClasses();
    const settings = await db.settings.toArray();
    
    return {
      classes,
      settings,
      exportDate: new Date().toISOString()
    };
  }
  
  // データをインポート
  async importData(data) {
    try {
      // 既存データをクリア
      await db.classes.clear();
      await db.settings.clear();
      
      // 新しいデータを追加
      if (data.classes) {
        await db.classes.bulkAdd(data.classes);
      }
      if (data.settings) {
        await db.settings.bulkAdd(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('データインポートエラー:', error);
      return false;
    }
  }
}

// サービスインスタンスを作成
export const timetableService = new TimetableService();