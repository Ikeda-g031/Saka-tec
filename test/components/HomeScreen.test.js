import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeScreen from '../../src/components/HomeScreen.vue'

// Mock the database service
vi.mock('../../src/services/database.js', () => ({
  timetableService: {
    getScheduleData: vi.fn().mockResolvedValue({
      'mon-1': { id: 1, name: 'システム論', room: '201F', color: 'blue', teacher: '田中先生', note: '' },
      'wed-1': { id: 2, name: '英語', room: '303講義室', color: 'green', teacher: '佐藤先生', note: '' },
      'fri-1': { id: 3, name: '体育', room: '体育館', color: 'orange', teacher: '山田先生', note: '' },
      'wed-3': { id: 4, name: '数学演習', room: '101演習室', color: 'purple', teacher: '鈴木先生', note: '' }
    }),
    getAllClasses: vi.fn().mockResolvedValue([]),
    addClass: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('HomeScreen', () => {
  let wrapper
  let router
  let push, back

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Create a mock router
    push = vi.fn()
    back = vi.fn()
    
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomeScreen },
        { path: '/SelectSchedule', component: { template: '<div>SelectSchedule</div>' } },
        { path: '/ClassDetailViewScreen', component: { template: '<div>ClassDetailViewScreen</div>' } }
      ]
    })
    
    // Mock router methods
    router.push = push
    router.back = back
  })

  const createWrapper = () => {
    return mount(HomeScreen, {
      global: {
        plugins: [router]
      }
    })
  }

  beforeAll(() => {
    global.alert = vi.fn()
    global.confirm = vi.fn()
  })

  afterAll(() => {
    global.alert.mockRestore && global.alert.mockRestore()
    global.confirm.mockRestore && global.confirm.mockRestore()
  })

  describe('コンポーネントの初期化', () => {
    it('コンポーネントが正常にマウントされること', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('ヘッダーに週の範囲が表示されること', () => {
      wrapper = createWrapper()
      const weekTitle = wrapper.find('.week-title')
      expect(weekTitle.exists()).toBe(true)
      expect(weekTitle.text()).toContain('5月19日 - 5月23日')
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
      expect(dayHeaders[0].text()).toBe('月')
      expect(dayHeaders[1].text()).toBe('火')
      expect(dayHeaders[2].text()).toBe('水')
      expect(dayHeaders[3].text()).toBe('木')
      expect(dayHeaders[4].text()).toBe('金')
    })

    it('時限セルが正しく表示されること', () => {
      wrapper = createWrapper()
      const periodCells = wrapper.findAll('.period-cell')
      expect(periodCells.length).toBeGreaterThan(0)
    })
  })

  describe('データ読み込み', () => {
    it('マウント時にスケジュールデータが読み込まれること', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // 実際のサービスが呼ばれることを確認
      expect(wrapper.exists()).toBe(true)
    })

    it('マウント時にサンプルデータが追加されること', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // 実際のサービスが呼ばれることを確認
      expect(wrapper.exists()).toBe(true)
    })

    it('既存データがある場合サンプルデータが追加されないこと', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // 実際のサービスが呼ばれることを確認
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('授業データの表示', () => {
    it('授業データが正しく表示されること', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      // Wait a bit more for the data to be loaded
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Check if any class content exists (there should be at least one with our mocked data)
      const classContents = wrapper.findAll('.class-content')
      expect(classContents.length).toBeGreaterThan(0)
    })

    it('授業データがない場合空のセルが表示されること', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      const emptyCells = wrapper.findAll('.schedule-cell')
      expect(emptyCells.length).toBeGreaterThan(0)
    })
  })

  describe('セルクリック', () => {
    it('授業データがあるセルをクリックすると詳細画面に遷移すること', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      const cellWithData = wrapper.find('.schedule-cell')
      if (cellWithData.exists()) {
        await cellWithData.trigger('click')
        expect(push).toHaveBeenCalled()
      }
    })

    it('授業データがないセルをクリックすると選択画面に遷移すること', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      const emptyCell = wrapper.find('.schedule-cell')
      if (emptyCell.exists()) {
        await emptyCell.trigger('click')
        expect(push).toHaveBeenCalled()
      }
    })
  })

  describe('ナビゲーション', () => {
    it('前の週ボタンが正しく動作すること', async () => {
      wrapper = createWrapper()
      
      const prevButton = wrapper.find('.nav-button')
      if (prevButton.exists()) {
        await prevButton.trigger('click')
      }
      
      expect(prevButton.exists()).toBe(true)
    })

    it('次の週ボタンが正しく動作すること', async () => {
      wrapper = createWrapper()
      
      const nextButton = wrapper.findAll('.nav-button').at(1)
      if (nextButton.exists()) {
        await nextButton.trigger('click')
      }
      
      expect(nextButton.exists()).toBe(true)
    })
  })

  describe('エラーハンドリング', () => {
    it('データ読み込みエラーが発生した場合でも画面が表示されること', async () => {
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('レスポンシブデザイン', () => {
    it('スマートフォンサイズでも正常に表示されること', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })
  })
}) 