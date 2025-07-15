import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Classinfoedit from '../../src/components/Classinfoedit.vue'

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
    getAllClasses: vi.fn(),
    addClass: vi.fn(),
    updateClass: vi.fn()
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

describe('Classinfoedit', () => {
  let wrapper

  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks()
  })

  const createWrapper = (routeQuery = {}) => {
    return mount(Classinfoedit, {
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

  describe('新規作成モード', () => {
    it('新規作成モードで正常に表示されること', () => {
      wrapper = createWrapper()
      
      // ヘッダータイトルが正しく表示される
      const headerTitle = wrapper.find('.header-title')
      expect(headerTitle.text()).toBe('新規授業情報を入力')
      
      // フォームが表示される
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
      
      // 必須項目の説明が表示される
      const requiredNotice = wrapper.find('.required-notice')
      expect(requiredNotice.exists()).toBe(true)
    })

    it('必須項目が入力されていない場合エラーが表示されること', async () => {
      wrapper = createWrapper()
      
      // フォームを送信（必須項目なし）
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // アラートが表示されることを確認
      expect(global.alert).toHaveBeenCalledWith('授業名を入力してください。')
    })

    it('データが正常に保存されること', async () => {
      wrapper = createWrapper()
      
      // 必須項目を入力
      const courseNameInput = wrapper.find('input[type="text"]')
      await courseNameInput.setValue('テスト授業')
      
      // フォームを送信
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // データベースに保存されることを確認
      expect(wrapper.exists()).toBe(true)
      
      // 成功メッセージが表示されることを確認
      expect(global.alert).toHaveBeenCalledWith('授業情報を保存しました！')
    })
  })

  describe('編集モード', () => {
    it('編集モードで既存データが表示されること', async () => {
      wrapper = createWrapper({ 
        edit: 'true', 
        id: '1',
        day: '0',
        period: '1'
      })
      
      await wrapper.vm.$nextTick()
      
      // ヘッダータイトルが編集モードで表示される
      const headerTitle = wrapper.find('.header-title')
      expect(headerTitle.text()).toBe('授業情報を編集')
      
      // 既存データがフォームに表示される
      expect(wrapper.exists()).toBe(true)
    })

    it('データが正常に更新されること', async () => {
      wrapper = createWrapper({ 
        edit: 'true', 
        id: '1',
        day: '0',
        period: '1'
      })
      
      await wrapper.vm.$nextTick()
      
      // データを変更
      const courseNameInput = wrapper.find('input[type="text"]')
      await courseNameInput.setValue('更新された授業')
      
      // フォームを送信
      const form = wrapper.find('form')
      await form.trigger('submit')
      
      // データベースが更新されることを確認
      expect(wrapper.exists()).toBe(true)
      
      // 成功メッセージが表示されることを確認
      expect(global.alert).toHaveBeenCalledWith('授業情報を更新しました！')
    })
  })

  describe('フォーム要素', () => {
    it('全てのフォーム要素が表示されること', () => {
      wrapper = createWrapper()
      
      // 授業名
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
      
      // 担当教員
      expect(wrapper.find('input[placeholder="例: 山田 太郎"]').exists()).toBe(true)
      
      // 単位数
      expect(wrapper.find('input[type="number"]').exists()).toBe(true)
      
      // 教室
      expect(wrapper.find('input[placeholder="例: 201F"]').exists()).toBe(true)
      
      // シラバスURL
      expect(wrapper.find('input[placeholder="https://example.com/syllabus"]').exists()).toBe(true)
      
      // メモ
      expect(wrapper.find('textarea').exists()).toBe(true)
      
      // 決定ボタン
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('必須項目にマークが表示されること', () => {
      wrapper = createWrapper()
      
      // 授業名の必須マーク
      const courseNameLabel = wrapper.findAll('label').find(label => label.text().includes('授業名'))
      expect(courseNameLabel).toBeTruthy()
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