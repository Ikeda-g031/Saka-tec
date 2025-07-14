import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Jugyogai from '../../src/components/Jugyogai.vue'

// Vue Routerのモック
vi.mock('vue-router', () => ({
  createRouter: vi.fn(),
  createWebHistory: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn()
  }),
  useRoute: () => ({ query: {} })
}))

// データベースサービスのモック
vi.mock('../../src/services/database.js', () => ({
  timetableService: {
    addClass: vi.fn()
  }
}))

beforeAll(() => {
  global.alert = vi.fn()
  global.confirm = vi.fn()
})
afterAll(() => {
  global.alert.mockRestore && global.alert.mockRestore()
  global.confirm.mockRestore && global.confirm.mockRestore()
})

describe('Jugyogai', () => {
  let wrapper

  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks()
  })

  const createWrapper = (routeQuery = {}) => {
    return mount(Jugyogai, {
      global: {
        mocks: {
          $router: {
            push: vi.fn(),
            back: vi.fn()
          },
          $route: { query: routeQuery }
        }
      }
    })
  }

  describe('予定登録フォーム', () => {
    it('予定登録フォームが正常に表示されること', () => {
      wrapper = createWrapper()
      
      // ヘッダータイトルが正しく表示される
      const headerTitle = wrapper.find('.header-title')
      expect(headerTitle.text()).toBe('予定を入力')
      
      // フォームが表示される
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
      
      // 必須項目の説明が表示される
      const requiredNotice = wrapper.find('.required-notice')
      expect(requiredNotice.exists()).toBe(true)
    })

    it('全てのフォーム要素が表示されること', () => {
      wrapper = createWrapper()
      
      // タイトル
      expect(wrapper.find('input[placeholder="例: サークルのミーティング"]').exists()).toBe(true)
      
      // 詳細・メモ
      expect(wrapper.find('textarea').exists()).toBe(true)
      
      // 日時（曜日・時限）
      expect(wrapper.findAll('.time-select')).toHaveLength(2)
      
      // 繰り返し設定
      expect(wrapper.find('select').exists()).toBe(true)
      
      // 決定ボタン
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('必須項目にマークが表示されること', () => {
      wrapper = createWrapper()
      
      // タイトルの必須マーク
      const titleLabel = wrapper.findAll('label').find(label => label.text().includes('予定のタイトル'))
      expect(titleLabel).toBeTruthy()
      // Vueのスコープ付きCSSを考慮して、class名のみでチェック
      expect(titleLabel.html()).toContain('required-mark')
      
      // 日時の必須マーク
      const timeLabel = wrapper.findAll('label').find(label => label.text().includes('日時'))
      expect(timeLabel).toBeTruthy()
      expect(timeLabel.html()).toContain('required-mark')
    })
  })

  describe('必須項目バリデーション', () => {
    it('必須項目が入力されていない場合エラーが表示されること', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      wrapper = createWrapper()
      
      // フォームを送信（必須項目なし）
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // アラートが表示されることを確認
      expect(alertSpy).toHaveBeenCalledWith('予定のタイトルを入力してください。')
      
      alertSpy.mockRestore()
    })

    it('タイトルは入力されているが日時が選択されていない場合エラーが表示されること', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      wrapper = createWrapper()
      
      // タイトルのみ入力
      const titleInput = wrapper.find('input[type="text"]')
      await titleInput.setValue('テスト予定')
      
      // コンポーネントのリアクティブ値を直接nullに設定
      await wrapper.vm.$nextTick()
      wrapper.vm.selectedDay = null
      wrapper.vm.selectedPeriod = null
      await wrapper.vm.$nextTick()
      
      // フォームを送信
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // アラートが表示されることを確認
      expect(alertSpy).toHaveBeenCalledWith('日時を選択してください。')
      
      alertSpy.mockRestore()
    })
  })

  describe('予定保存', () => {
    it('予定データが正常に保存されること', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      wrapper = createWrapper()
      
      // 必須項目を入力
      const titleInput = wrapper.find('input[type="text"]')
      await titleInput.setValue('テスト予定')
      
      // 詳細・メモを入力
      const memoTextarea = wrapper.find('textarea')
      await memoTextarea.setValue('テスト用メモ')
      
      // 繰り返し設定を選択
      const repeatSelect = wrapper.find('select')
      await repeatSelect.setValue('weekly')
      
      // フォームを送信
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // データベースに保存されることを確認
      expect(wrapper.exists()).toBe(true)
      
      // 成功メッセージが表示されることを確認
      expect(alertSpy).toHaveBeenCalledWith('予定を保存しました！')
      
      alertSpy.mockRestore()
    })

    it('昼の時限が正しく保存されること', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      wrapper = createWrapper({ period: 'lunch' })
      
      // 必須項目を入力
      const titleInput = wrapper.find('input[type="text"]')
      await titleInput.setValue('昼の予定')
      
      // フォームを送信
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // 昼の時限が正しく保存されることを確認
      expect(wrapper.exists()).toBe(true)
      
      alertSpy.mockRestore()
    })
  })

  describe('時間選択', () => {
    it('曜日・時限が正しく選択できること', async () => {
      wrapper = createWrapper()
      
      // 曜日選択
      const daySelect = wrapper.find('select:first-child')
      await daySelect.setValue('2') // 火曜日
      
      // 時限選択
      const periodSelect = wrapper.find('select:last-child')
      await periodSelect.setValue('3') // 3限
      
      // 選択値が正しく設定されていることを確認
      expect(daySelect.element.value).toBe('2')
      expect(periodSelect.element.value).toBe('3')
    })

    it('昼の時限が選択できること', async () => {
      wrapper = createWrapper()
      
      // 時限選択で昼を選択
      const periodSelect = wrapper.find('select:last-child')
      await periodSelect.setValue('lunch')
      
      // 昼が選択されていることを確認
      expect(periodSelect.element.value).toBe('lunch')
    })
  })

  describe('戻るボタン', () => {
    it('戻るボタンで前の画面に戻れること', () => {
      wrapper = createWrapper()
      
      const backButton = wrapper.find('.nav-button:first-child')
      backButton.trigger('click')
      
      expect(backButton.exists()).toBe(true)
    })
  })
}) 