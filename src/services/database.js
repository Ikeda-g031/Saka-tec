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
      classes: '++id, name, room, day, period, color, teacher, note, repeat, repeatEndType, repeatEndDate, repeatCount, createdAt, updatedAt',
      
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
  async addClass(classData, weekStart = null) {
    const now = new Date();
    
    // 週情報が指定されている場合、作成日時を調整
    let createdAt = now;
    if (weekStart) {
      // 週の開始日を基準に作成日時を設定
      const weekStartDate = new Date(weekStart);
      const dayOfWeek = classData.day; // 0=月, 1=火, ..., 4=金
      const targetDate = new Date(weekStartDate);
      targetDate.setDate(weekStartDate.getDate() + dayOfWeek);
      createdAt = targetDate;
    }
    
    const classWithTimestamp = {
      ...classData,
      createdAt: createdAt,
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
  async getScheduleData(targetWeekStart = null) {
    const classes = await this.getAllClasses();
    console.log('データベースから取得した生データ:', classes);
    const scheduleData = {};
    
    // 曜日マッピング
    const dayMap = {
      0: 'mon', 1: 'tue', 2: 'wed', 3: 'thu', 4: 'fri'
    };
    
    // 対象週の開始日を設定（指定がない場合は現在の週）
    const weekStart = targetWeekStart || this.getWeekStart(new Date());
    
    // 各授業データを処理
    classes.forEach(classItem => {
      const cellId = `${dayMap[classItem.day]}-${classItem.period}`;
      
      // 繰り返し設定に基づいて授業を表示するかチェック
      if (this.shouldShowClass(classItem, weekStart)) {
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
      }
    });
    
    console.log('変換後のスケジュールデータ:', scheduleData);
    return scheduleData;
  }

  // 週の開始日を取得（月曜日）
  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // 繰り返し設定に基づいて授業を表示するかチェック
  shouldShowClass(classItem, weekStart) {
    // 作成日を取得
    const createdDate = new Date(classItem.createdAt);
    const createdWeekStart = this.getWeekStart(createdDate);
    
    // 作成週と対象週の差を計算（週単位）
    const weekDiff = Math.floor((weekStart.getTime() - createdWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    // 繰り返し設定に基づく判定
    switch (classItem.repeat) {
      case 'none':
        // 繰り返さない場合は作成された週のみ表示
        return weekDiff === 0;
        
      case 'weekly':
        // 毎週の場合は作成週以降に表示
        return weekDiff >= 0 && this.checkRepeatEnd(classItem, weekStart, weekDiff);
        
      default:
        // 繰り返し設定がない場合は作成された週のみ表示
        return weekDiff === 0;
    }
  }

  // 繰り返し終了条件をチェック
  checkRepeatEnd(classItem, weekStart, weekDiff) {
    // 終了条件がない場合は常に表示
    if (!classItem.repeatEndType || classItem.repeatEndType === 'never') {
      return true;
    }

    // 指定日まで
    if (classItem.repeatEndType === 'date' && classItem.repeatEndDate) {
      const endDate = new Date(classItem.repeatEndDate);
      return weekStart <= endDate;
    }

    // 指定回数まで
    if (classItem.repeatEndType === 'count' && classItem.repeatCount) {
      return weekDiff < classItem.repeatCount;
    }

    return true;
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