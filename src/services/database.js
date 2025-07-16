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
    
    // 同じセル（曜日・時限）に既存の授業がある場合は削除
    const existingClasses = await this.getClassesByDayAndPeriod(classData.day, classData.period);
    if (existingClasses.length > 0) {
      console.log('同じセルに既存の授業が見つかりました。削除します:', existingClasses);
      for (const existingClass of existingClasses) {
        await this.deleteClass(existingClass.id);
      }
    }
    
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

  // 特定の曜日・時限の全授業を取得（重複チェック用）
  async getClassesByDayAndPeriod(day, period) {
    return await db.classes
      .where({ day: day, period: period })
      .toArray();
  }
  
  // 時間割形式のデータを取得
  async getScheduleData() {
    const classes = await this.getAllClasses();
    console.log('データベースから取得した生データ:', classes);
    const scheduleData = {};
    
    // 曜日マッピング
    const dayMap = {
      0: 'mon', 1: 'tue', 2: 'wed', 3: 'thu', 4: 'fri'
    };
    
    // 同じセルに複数のデータがある場合、最新のもの（IDが最大）を使用
    classes.forEach(classItem => {
      const cellId = `${dayMap[classItem.day]}-${classItem.period}`;
      
      // 既存のデータがない場合、または既存のデータよりIDが大きい場合のみ更新
      if (!scheduleData[cellId] || scheduleData[cellId].id < classItem.id) {
        scheduleData[cellId] = {
          id: classItem.id,
          name: classItem.name,
          room: classItem.room,
          color: classItem.color,
          teacher: classItem.teacher,
          note: classItem.note
        };
      }
    });
    
    console.log('変換後のスケジュールデータ:', scheduleData);
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

  // データの整合性チェック・クリーンアップ
  async cleanupDuplicateData() {
    try {
      const allClasses = await this.getAllClasses();
      const seenCells = new Map();
      const duplicateIds = [];

      // 同じセルに複数のデータがある場合、古いものを削除対象とする
      allClasses.forEach(classItem => {
        const cellKey = `${classItem.day}-${classItem.period}`;
        
        if (seenCells.has(cellKey)) {
          const existingClass = seenCells.get(cellKey);
          // IDが小さい（古い）方を削除対象とする
          if (classItem.id > existingClass.id) {
            duplicateIds.push(existingClass.id);
            seenCells.set(cellKey, classItem);
          } else {
            duplicateIds.push(classItem.id);
          }
        } else {
          seenCells.set(cellKey, classItem);
        }
      });

      // 重複データを削除
      if (duplicateIds.length > 0) {
        console.log('重複データを削除します:', duplicateIds);
        for (const id of duplicateIds) {
          await this.deleteClass(id);
        }
      }

      return duplicateIds.length;
    } catch (error) {
      console.error('データクリーンアップエラー:', error);
      return 0;
    }
  }
}

// サービスインスタンスを作成
export const timetableService = new TimetableService();