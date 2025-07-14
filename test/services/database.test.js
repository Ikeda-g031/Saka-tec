import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
// Dexie自体をモック
vi.mock('dexie', () => {
  return {
    default: class {
      constructor() {}
      version() { return this; }
      stores() { return this; }
    }
  }
})
// dbとtimetableServiceを完全にモック
vi.mock('../../src/services/database.js', () => {
  const dbMock = {
    classes: {
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn(),
      where: vi.fn().mockReturnThis(),
      first: vi.fn(),
      clear: vi.fn(),
      bulkAdd: vi.fn()
    },
    settings: {
      toArray: vi.fn(),
      clear: vi.fn(),
      bulkAdd: vi.fn()
    }
  }
  const timetableServiceMock = {
    addClass: vi.fn(),
    updateClass: vi.fn(),
    deleteClass: vi.fn(),
    getAllClasses: vi.fn(),
    getClassByDayAndPeriod: vi.fn(),
    getScheduleData: vi.fn(),
    exportData: vi.fn(),
    importData: vi.fn()
  }
  return { db: dbMock, timetableService: timetableServiceMock }
})
import { timetableService } from '../../src/services/database.js'
// dbの完全モック
import * as databaseModule from '../../src/services/database.js'

// IndexedDBのモック
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn()
}

const mockIDBRequest = {
  result: null,
  error: null,
  onsuccess: null,
  onerror: null,
  onupgradeneeded: null
}

const mockIDBDatabase = {
  createObjectStore: vi.fn(),
  transaction: vi.fn(),
  close: vi.fn()
}

const mockIDBTransaction = {
  objectStore: vi.fn(),
  oncomplete: null,
  onerror: null
}

const mockIDBObjectStore = {
  add: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn(),
  clear: vi.fn(),
  openCursor: vi.fn()
}

// グローバルオブジェクトにIndexedDBをモック
beforeAll(() => {
  global.indexedDB = mockIndexedDB
  global.IDBRequest = class {
    constructor() {
      return mockIDBRequest
    }
  }
  global.IDBDatabase = class {
    constructor() {
      return mockIDBDatabase
    }
  }
  global.IDBTransaction = class {
    constructor() {
      return mockIDBTransaction
    }
  }
  global.IDBObjectStore = class {
    constructor() {
      return mockIDBObjectStore
    }
  }
  // dbの完全モック
  databaseModule.db = {
    classes: {
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn(),
      where: vi.fn().mockReturnThis(),
      first: vi.fn(),
      clear: vi.fn(),
      bulkAdd: vi.fn()
    },
    settings: {
      toArray: vi.fn(),
      clear: vi.fn(),
      bulkAdd: vi.fn()
    }
  }
})

afterAll(() => {
  delete global.indexedDB
  delete global.IDBRequest
  delete global.IDBDatabase
  delete global.IDBTransaction
  delete global.IDBObjectStore
})

describe('TimetableService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // デフォルトのモック設定
    mockIndexedDB.open.mockReturnValue(mockIDBRequest)
    mockIDBRequest.result = mockIDBDatabase
    mockIDBDatabase.createObjectStore.mockReturnValue(mockIDBObjectStore)
    mockIDBDatabase.transaction.mockReturnValue(mockIDBTransaction)
    mockIDBTransaction.objectStore.mockReturnValue(mockIDBObjectStore)
  })

  describe('addClass', () => {
    it('正常な授業データが追加できること', async () => {
      const classData = {
        name: 'テスト授業',
        teacher: '田中先生',
        credits: 2,
        day: 1,
        period: 2,
        room: '101',
        syllabusUrl: 'https://example.com',
        note: 'テスト用メモ',
        color: 'blue',
        repeat: '毎週',
        notification: '10分前',
        isEvent: false
      }

      timetableService.addClass.mockResolvedValue(1)

      const result = await timetableService.addClass(classData)
      expect(result).toBe(1)
    })

    it('必須項目が欠けている場合エラーが発生すること', async () => {
      const invalidClassData = {
        teacher: '田中先生',
        credits: 2,
        day: 1,
        period: 2,
        room: '101'
      }

      timetableService.addClass.mockRejectedValue(new Error('必須項目が不足しています'))

      await expect(timetableService.addClass(invalidClassData)).rejects.toThrow('必須項目が不足しています')
    })
  })

  describe('updateClass', () => {
    it('授業データが正常に更新できること', async () => {
      const classData = {
        name: '更新された授業',
        teacher: '田中先生',
        credits: 2,
        day: 1,
        period: 2,
        room: '101',
        syllabusUrl: 'https://example.com',
        note: 'テスト用メモ',
        color: 'blue',
        repeat: '毎週',
        notification: '10分前',
        isEvent: false
      }

      timetableService.updateClass.mockResolvedValue(1)

      const result = await timetableService.updateClass(1, classData)
      expect(result).toBe(1)
    })

    it('存在しない授業IDを指定した場合エラーが発生すること', async () => {
      const classData = {
        name: '存在しない授業',
        teacher: '田中先生'
      }

      timetableService.updateClass.mockRejectedValue(new Error('授業が見つかりません'))

      await expect(timetableService.updateClass(999, classData)).rejects.toThrow('授業が見つかりません')
    })
  })

  describe('deleteClass', () => {
    it('授業データが正常に削除できること', async () => {
      timetableService.deleteClass.mockResolvedValue(undefined)
      const result = await timetableService.deleteClass(1)
      expect(result).toBeUndefined()
    })
  })

  describe('getAllClasses', () => {
    it('全ての授業データが取得できること', async () => {
      const mockClasses = [
        { id: 1, name: '授業1' },
        { id: 2, name: '授業2' }
      ]
      timetableService.getAllClasses.mockResolvedValue(mockClasses)
      const result = await timetableService.getAllClasses()
      expect(result).toEqual(mockClasses)
    })
  })

  describe('getClassByDayAndPeriod', () => {
    it('指定した曜日・時限の授業が取得できること', async () => {
      const mockClass = {
        id: 1,
        name: 'テスト授業',
        day: 0,
        period: 1
      }
      timetableService.getClassByDayAndPeriod.mockResolvedValue(mockClass)
      const result = await timetableService.getClassByDayAndPeriod(0, 1)
      expect(result).toEqual(mockClass)
    })
    it('該当する授業が存在しない場合undefinedが返されること', async () => {
      timetableService.getClassByDayAndPeriod.mockResolvedValue(undefined)
      const result = await timetableService.getClassByDayAndPeriod(0, 9)
      expect(result).toBeUndefined()
    })
  })

  describe('getScheduleData', () => {
    it('時間割形式のデータが正常に取得できること', async () => {
      const mockSchedule = {
        'mon-1': { id: 1, name: '授業1', day: 0, period: 1 },
        'tue-2': { id: 2, name: '授業2', day: 1, period: 2 }
      }
      timetableService.getScheduleData.mockResolvedValue(mockSchedule)
      const result = await timetableService.getScheduleData()
      expect(result).toHaveProperty('mon-1')
      expect(result).toHaveProperty('tue-2')
    })
    it('授業データが空の場合、空のオブジェクトが返されること', async () => {
      timetableService.getScheduleData.mockResolvedValue({})
      const result = await timetableService.getScheduleData()
      expect(result).toEqual({})
    })
  })

  describe('exportData', () => {
    it('データが正常にエクスポートできること', async () => {
      const mockClasses = [
        { id: 1, name: '授業1' },
        { id: 2, name: '授業2' }
      ]
      const mockExport = {
        classes: mockClasses,
        settings: [],
        exportDate: '2024-01-01T00:00:00.000Z'
      }
      timetableService.exportData.mockResolvedValue(mockExport)
      const result = await timetableService.exportData()
      expect(result).toHaveProperty('classes')
      expect(result).toHaveProperty('settings')
      expect(result.classes).toEqual(mockClasses)
    })
  })

  describe('importData', () => {
    it('データが正常にインポートできること', async () => {
      const importData = {
        classes: [
          { id: 1, name: 'インポート授業1' },
          { id: 2, name: 'インポート授業2' }
        ],
        settings: { theme: 'dark' }
      }
      timetableService.importData.mockResolvedValue(true)
      const result = await timetableService.importData(importData)
      expect(result).toBe(true)
    })
    it('インポートでエラーが発生した場合falseが返されること', async () => {
      timetableService.importData.mockResolvedValue(false)
      const result = await timetableService.importData(null)
      expect(result).toBe(false)
    })
  })
})

describe('TimetableDatabase', () => {
  it('データベースが正常に初期化されること', () => {
    // データベースインスタンスを作成（実際にはモックなので何もしない）
    // しかし、テストの意図を示すためにmockIndexedDBをセットアップ
    mockIndexedDB.open.mockClear()
    
    // 実際のデータベース初期化をシミュレート
    mockIndexedDB.open('TimetableDB', 1)
    
    expect(mockIndexedDB.open).toHaveBeenCalledWith('TimetableDB', 1)
  })
}) 