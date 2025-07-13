import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TimetableService, TimetableDatabase } from '../../src/services/database.js'

describe('TimetableService', () => {
  let service
  let mockDB

  beforeEach(() => {
    // データベースのモックを作成
    mockDB = {
      classes: {
        add: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        toArray: vi.fn(),
        where: vi.fn().mockReturnThis(),
        first: vi.fn(),
        clear: vi.fn(),
        bulkAdd: vi.fn(),
      },
      settings: {
        toArray: vi.fn(),
        clear: vi.fn(),
        bulkAdd: vi.fn(),
      }
    }

    // サービスのインスタンスを作成
    service = new TimetableService()
    // データベースのインスタンスをモックに置き換え
    service.db = mockDB
  })

  describe('addClass', () => {
    it('正常な授業データが追加できること', async () => {
      // Arrange
      const classData = {
        name: '数学',
        room: '101',
        day: 0,
        period: 1,
        color: 'blue',
        teacher: '田中先生',
        note: 'テスト用データ'
      }
      const expectedId = 1
      mockDB.classes.add.mockResolvedValue(expectedId)

      // Act
      const result = await service.addClass(classData)

      // Assert
      expect(result).toBe(expectedId)
      expect(mockDB.classes.add).toHaveBeenCalledOnce()
      const addedData = mockDB.classes.add.mock.calls[0][0]
      expect(addedData).toMatchObject(classData)
      expect(addedData.createdAt).toBeInstanceOf(Date)
      expect(addedData.updatedAt).toBeInstanceOf(Date)
    })

    it('必須項目が欠けている場合エラーが発生すること', async () => {
      // Arrange
      const invalidClassData = {
        // nameが欠けている
        room: '101',
        day: 0,
        period: 1
      }
      mockDB.classes.add.mockRejectedValue(new Error('必須項目が不足しています'))

      // Act & Assert
      await expect(service.addClass(invalidClassData)).rejects.toThrow('必須項目が不足しています')
    })
  })

  describe('updateClass', () => {
    it('授業データが正常に更新できること', async () => {
      // Arrange
      const classId = 1
      const updateData = {
        name: '数学演習',
        room: '102',
        teacher: '佐藤先生'
      }
      mockDB.classes.update.mockResolvedValue(1)

      // Act
      const result = await service.updateClass(classId, updateData)

      // Assert
      expect(result).toBe(1)
      expect(mockDB.classes.update).toHaveBeenCalledWith(classId, {
        ...updateData,
        updatedAt: expect.any(Date)
      })
    })

    it('存在しない授業IDを指定した場合エラーが発生すること', async () => {
      // Arrange
      const nonExistentId = 999
      const updateData = { name: '存在しない授業' }
      mockDB.classes.update.mockRejectedValue(new Error('授業が見つかりません'))

      // Act & Assert
      await expect(service.updateClass(nonExistentId, updateData)).rejects.toThrow('授業が見つかりません')
    })
  })

  describe('deleteClass', () => {
    it('授業データが正常に削除できること', async () => {
      // Arrange
      const classId = 1
      mockDB.classes.delete.mockResolvedValue(undefined)

      // Act
      const result = await service.deleteClass(classId)

      // Assert
      expect(result).toBeUndefined()
      expect(mockDB.classes.delete).toHaveBeenCalledWith(classId)
    })
  })

  describe('getAllClasses', () => {
    it('全ての授業データが取得できること', async () => {
      // Arrange
      const mockClasses = [
        { id: 1, name: '数学', day: 0, period: 1 },
        { id: 2, name: '英語', day: 1, period: 2 }
      ]
      mockDB.classes.toArray.mockResolvedValue(mockClasses)

      // Act
      const result = await service.getAllClasses()

      // Assert
      expect(result).toEqual(mockClasses)
      expect(mockDB.classes.toArray).toHaveBeenCalledOnce()
    })
  })

  describe('getClassByDayAndPeriod', () => {
    it('指定した曜日・時限の授業が取得できること', async () => {
      // Arrange
      const day = 0
      const period = 1
      const mockClass = { id: 1, name: '数学', day: 0, period: 1 }
      mockDB.classes.where.mockReturnValue({
        first: vi.fn().mockResolvedValue(mockClass)
      })

      // Act
      const result = await service.getClassByDayAndPeriod(day, period)

      // Assert
      expect(result).toEqual(mockClass)
      expect(mockDB.classes.where).toHaveBeenCalledWith({ day, period })
    })

    it('該当する授業が存在しない場合undefinedが返されること', async () => {
      // Arrange
      const day = 0
      const period = 1
      mockDB.classes.where.mockReturnValue({
        first: vi.fn().mockResolvedValue(undefined)
      })

      // Act
      const result = await service.getClassByDayAndPeriod(day, period)

      // Assert
      expect(result).toBeUndefined()
    })
  })

  describe('getScheduleData', () => {
    it('時間割形式のデータが正常に取得できること', async () => {
      // Arrange
      const mockClasses = [
        { id: 1, name: '数学', room: '101', day: 0, period: 1, color: 'blue', teacher: '田中先生', note: '' },
        { id: 2, name: '英語', room: '102', day: 1, period: 2, color: 'green', teacher: '佐藤先生', note: '' }
      ]
      mockDB.classes.toArray.mockResolvedValue(mockClasses)

      // Act
      const result = await service.getScheduleData()

      // Assert
      expect(result).toEqual({
        'mon-1': {
          id: 1,
          name: '数学',
          room: '101',
          color: 'blue',
          teacher: '田中先生',
          note: ''
        },
        'tue-2': {
          id: 2,
          name: '英語',
          room: '102',
          color: 'green',
          teacher: '佐藤先生',
          note: ''
        }
      })
    })

    it('授業データが空の場合、空のオブジェクトが返されること', async () => {
      // Arrange
      mockDB.classes.toArray.mockResolvedValue([])

      // Act
      const result = await service.getScheduleData()

      // Assert
      expect(result).toEqual({})
    })
  })

  describe('exportData', () => {
    it('データが正常にエクスポートできること', async () => {
      // Arrange
      const mockClasses = [{ id: 1, name: '数学' }]
      const mockSettings = [{ id: 1, key: 'theme', value: 'dark' }]
      mockDB.classes.toArray.mockResolvedValue(mockClasses)
      mockDB.settings.toArray.mockResolvedValue(mockSettings)

      // Act
      const result = await service.exportData()

      // Assert
      expect(result).toEqual({
        classes: mockClasses,
        settings: mockSettings,
        exportDate: expect.any(String)
      })
    })
  })

  describe('importData', () => {
    it('データが正常にインポートできること', async () => {
      // Arrange
      const importData = {
        classes: [{ id: 1, name: '数学' }],
        settings: [{ id: 1, key: 'theme', value: 'dark' }]
      }
      mockDB.classes.clear.mockResolvedValue()
      mockDB.settings.clear.mockResolvedValue()
      mockDB.classes.bulkAdd.mockResolvedValue()
      mockDB.settings.bulkAdd.mockResolvedValue()

      // Act
      const result = await service.importData(importData)

      // Assert
      expect(result).toBe(true)
      expect(mockDB.classes.clear).toHaveBeenCalledOnce()
      expect(mockDB.settings.clear).toHaveBeenCalledOnce()
      expect(mockDB.classes.bulkAdd).toHaveBeenCalledWith(importData.classes)
      expect(mockDB.settings.bulkAdd).toHaveBeenCalledWith(importData.settings)
    })

    it('インポートでエラーが発生した場合falseが返されること', async () => {
      // Arrange
      const importData = { classes: [], settings: [] }
      mockDB.classes.clear.mockRejectedValue(new Error('データベースエラー'))

      // Act
      const result = await service.importData(importData)

      // Assert
      expect(result).toBe(false)
    })
  })
})

describe('TimetableDatabase', () => {
  it('データベースが正常に初期化されること', () => {
    // Arrange & Act
    const db = new TimetableDatabase()

    // Assert
    expect(db.name).toBe('TimetableDB')
    expect(db.verno).toBe(1)
  })
}) 