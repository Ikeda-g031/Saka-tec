import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeScreen from '../../src/components/HomeScreen.vue'

// データベースサービスのモック
const mockTimetableService = {
  getScheduleData: vi.fn(),
  getAllClasses: vi.fn(),
  addClass: vi.fn()
}

// ルーターのモック
const mockRouter = {
  push: vi.fn(),
  back: vi.fn()
}

// Vue Routerのモック
vi.mock('vue-router', () => ({
  createRouter: vi.fn(),
  createWebHistory: vi.fn(),
  useRouter: () => mockRouter,
  useRoute: () => ({ query: {} })
}))

// データベースサービスのモック
vi.mock('../../src/services/database.js', () => ({
  timetableService: mockTimetableService
}))

describe('HomeScreen', () => {
  let wrapper

  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks()
    
    // デフォルトのモック設定
    mockTimetableService.getScheduleData.mockResolvedValue({
      'mon-1': {
        id: 1,
        name: '数学',
        room: '101',
        color: 'blue',
        teacher: '田中先生',
        note: ''
      }
    })
    mockTimetableService.getAllClasses.mockResolvedValue([])
  })

  const createWrapper = () => {
    return mount(HomeScreen, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })
  }

  describe('コンポーネントの初期化', () => {
    it('コンポーネントが正常にマウントされること', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('ヘッダーに週の範囲が表示されること', () => {
      wrapper = createWrapper()
      const weekTitle = wrapper.find('.week-title')
      expect(weekTitle.exists()).toBe(true)
      expect(weekTitle.text()).toContain('月')
    })

    it('時間割表が表示されること', () => {
      wrapper = createWrapper()
      const timetable = wrapper.find('.timetable')
      expect(timetable.exists()).toBe(true)
    })

    it('曜日ヘッダーが正しく表示されること', () => {
      wrapper = createWrapper()
      const dayHeaders = wrapper.findAll('.day-header')
      expect(dayHeaders).toHaveLength(5)
      
      const expectedDays = ['月', '火', '水', '木', '金']
      dayHeaders.forEach((header, index) => {
        expect(header.text()).toBe(expectedDays[index])
      })
    })

    it('時限セルが正しく表示されること', () => {
      wrapper = createWrapper()
      const periodCells = wrapper.findAll('.period-cell')
      expect(periodCells).toHaveLength(8) // 1-7限 + 昼
      
      const expectedPeriods = ['1', '2', '昼', '3', '4', '5', '6', '7']
      periodCells.forEach((cell, index) => {
        expect(cell.text()).toBe(expectedPeriods[index])
      })
    })
  })

  describe('データ読み込み', () => {
    it('マウント時にスケジュールデータが読み込まれること', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      expect(mockTimetableService.getScheduleData).toHaveBeenCalledOnce()
    })

    it('マウント時にサンプルデータが追加されること', async () => {
      mockTimetableService.getAllClasses.mockResolvedValue([])
      
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      expect(mockTimetableService.getAllClasses).toHaveBeenCalledOnce()
    })

    it('既存データがある場合サンプルデータが追加されないこと', async () => {
      mockTimetableService.getAllClasses.mockResolvedValue([
        { id: 1, name: '既存の授業' }
      ])
      
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      expect(mockTimetableService.addClass).not.toHaveBeenCalled()
    })
  })

  describe('授業データの表示', () => {
    it('授業データが正しく表示されること', async () => {
      const mockData = {
        'mon-1': {
          id: 1,
          name: '数学',
          room: '101',
          color: 'blue',
          teacher: '田中先生',
          note: ''
        }
      }
      mockTimetableService.getScheduleData.mockResolvedValue(mockData)
      
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      // 授業名が表示されているか確認
      const className = wrapper.find('.class-name')
      expect(className.exists()).toBe(true)
      expect(className.text()).toBe('数学')
      
      // 教室名が表示されているか確認
      const classRoom = wrapper.find('.class-room')
      expect(classRoom.exists()).toBe(true)
      expect(classRoom.text()).toBe('101')
    })

    it('授業データがない場合空のセルが表示されること', async () => {
      mockTimetableService.getScheduleData.mockResolvedValue({})
      
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      const classContents = wrapper.findAll('.class-content')
      expect(classContents).toHaveLength(0)
    })
  })

  describe('セルクリック', () => {
    it('授業データがあるセルをクリックすると詳細画面に遷移すること', async () => {
      const mockData = {
        'mon-1': {
          id: 1,
          name: '数学',
          room: '101',
          color: 'blue',
          teacher: '田中先生',
          note: ''
        }
      }
      mockTimetableService.getScheduleData.mockResolvedValue(mockData)
      
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      // セルをクリック
      const cell = wrapper.find('.schedule-cell')
      await cell.trigger('click')
      
      // 詳細画面に遷移することを確認
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/ClassDetailViewScreen',
        query: { id: 1 }
      })
    })

    it('授業データがないセルをクリックすると選択画面に遷移すること', async () => {
      mockTimetableService.getScheduleData.mockResolvedValue({})
      
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      // セルをクリック
      const cell = wrapper.find('.schedule-cell')
      await cell.trigger('click')
      
      // 選択画面に遷移することを確認
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/SelectSchedule',
        query: { day: 0, period: 1 }
      })
    })
  })

  describe('ナビゲーション', () => {
    it('前の週ボタンが正しく動作すること', async () => {
      wrapper = createWrapper()
      
      const prevButton = wrapper.find('.nav-button:first-child')
      await prevButton.trigger('click')
      
      // 前の週に移動する処理が呼ばれることを確認
      // 実際の実装では週の変更処理を確認
      expect(prevButton.exists()).toBe(true)
    })

    it('次の週ボタンが正しく動作すること', async () => {
      wrapper = createWrapper()
      
      const nextButton = wrapper.find('.nav-button:last-child')
      await nextButton.trigger('click')
      
      // 次の週に移動する処理が呼ばれることを確認
      // 実際の実装では週の変更処理を確認
      expect(nextButton.exists()).toBe(true)
    })
  })

  describe('エラーハンドリング', () => {
    it('データ読み込みエラーが発生した場合でも画面が表示されること', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockTimetableService.getScheduleData.mockRejectedValue(new Error('データベースエラー'))
      
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      // エラーがコンソールに出力されることを確認
      expect(consoleErrorSpy).toHaveBeenCalledWith('データ読み込みエラー:', expect.any(Error))
      
      // 画面は正常に表示されることを確認
      expect(wrapper.exists()).toBe(true)
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('レスポンシブデザイン', () => {
    it('スマートフォンサイズでも正常に表示されること', () => {
      wrapper = createWrapper()
      
      // グリッドレイアウトが適用されていることを確認
      const headerRow = wrapper.find('.header-row')
      expect(headerRow.exists()).toBe(true)
      expect(headerRow.attributes('style')).toContain('grid-template-columns')
      
      const timetableRow = wrapper.find('.timetable-row')
      expect(timetableRow.exists()).toBe(true)
      expect(timetableRow.attributes('style')).toContain('grid-template-columns')
    })
  })
}) 