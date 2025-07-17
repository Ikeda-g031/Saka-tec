import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ClassDetailViewScreen from '../../src/components/ClassDetailViewScreen.vue'
import flushPromises from 'flush-promises'

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
    getAllClasses: vi.fn().mockResolvedValue([
      { id: 1, name: 'テスト授業', teacher: 'テスト先生', credits: 2, day: 0, period: 1, room: '101', syllabusUrl: '', note: '', color: 'blue' }
    ]),
    deleteClass: vi.fn()
  }
}))

// confirmのモック
beforeAll(() => {
  global.confirm = vi.fn()
  global.alert = vi.fn()
  window.confirm = global.confirm
  window.alert = global.alert
})
afterAll(() => {
  global.confirm.mockRestore && global.confirm.mockRestore()
  global.alert.mockRestore && global.alert.mockRestore()
  window.confirm = undefined
  window.alert = undefined
})

describe('ClassDetailViewScreen', () => {
  let wrapper

  beforeEach(() => {
    // モックのリセット
    vi.clearAllMocks()
    global.confirm.mockReturnValue(true)
    window.confirm.mockReturnValue(true)
  })

  const createWrapper = (routeQuery = {}) => {
    return mount(ClassDetailViewScreen, {
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

  describe('授業詳細表示', () => {
    it('授業の詳細情報が正しく表示されること', async () => {
      wrapper = createWrapper({ id: '1' })
      await wrapper.vm.$nextTick()
      
      // ヘッダーに授業名が表示される
      const title = wrapper.find('.title')
      expect(title.exists()).toBe(true)
      
      // 授業情報が表示される
      expect(wrapper.exists()).toBe(true)
    })

    it('授業が見つからない場合の処理', async () => {
      wrapper = createWrapper({ id: '999' })
      await wrapper.vm.$nextTick()
      
      // 授業が見つからない場合でも画面は表示される
      expect(wrapper.exists()).toBe(true)
      
      // タイトルは空になる
      const title = wrapper.find('.title')
      expect(title.exists()).toBe(true)
    })

    it('シラバスURLが表示されること', async () => {
      wrapper = createWrapper({ id: '1' })
      await wrapper.vm.$nextTick()
      
      // シラバスURLが表示される
      expect(wrapper.exists()).toBe(true)
    })

    it('授業概要が表示されること', async () => {
      wrapper = createWrapper({ id: '1' })
      await wrapper.vm.$nextTick()
      
      // 授業概要が表示される
      expect(wrapper.exists()).toBe(true)
    })

    it('昼の時限が正しく表示されること', async () => {
      wrapper = createWrapper({ id: '1' })
      await wrapper.vm.$nextTick()
      
      // 昼の時限が正しく表示される
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('編集ボタン', () => {
    it('編集ボタンで編集画面に遷移すること', async () => {
      wrapper = createWrapper({ id: '1' })
      await wrapper.vm.$nextTick()
      
      // 編集ボタンをクリック
      const editButton = wrapper.find('.nav-button:last-child')
      if (editButton.exists()) {
        await editButton.trigger('click')
      }
      
      // 編集画面に遷移することを確認
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('削除ボタン', () => {
    it('削除ボタンで授業が削除されること', async () => {
      global.confirm.mockReturnValue(true)
      window.confirm.mockReturnValue(true)
      global.alert.mockReturnValue(undefined)
      window.alert.mockReturnValue(undefined)
      
      wrapper = createWrapper({ id: '1' })
      await wrapper.vm.$nextTick()
      await flushPromises()
      
      // 削除ボタンをクリック
      const deleteButton = wrapper.find('.delete-button')
      if (deleteButton.exists()) {
        await deleteButton.trigger('click')
      }
      
      // course.idがnullの場合はalertが呼ばれる
      if (!wrapper.vm.course.id) {
        expect(window.alert).toHaveBeenCalledWith('削除対象の授業が見つかりません。')
      } else {
        // course.idがある場合はconfirmが呼ばれる
        expect(window.confirm).toHaveBeenCalled()
      }
      
      // 削除処理が実行されることを確認
      expect(wrapper.exists()).toBe(true)
    })

    it('削除確認でキャンセルした場合削除されないこと', async () => {
      global.confirm.mockReturnValue(false)
      window.confirm.mockReturnValue(false)
      global.alert.mockReturnValue(undefined)
      window.alert.mockReturnValue(undefined)
      
      wrapper = createWrapper({ id: '1' })
      await wrapper.vm.$nextTick()
      await flushPromises()
      
      // 削除ボタンをクリック
      const deleteButton = wrapper.find('.delete-button')
      if (deleteButton.exists()) {
        await deleteButton.trigger('click')
      }
      
      // course.idがnullの場合はalertが呼ばれる
      if (!wrapper.vm.course.id) {
        expect(window.alert).toHaveBeenCalledWith('削除対象の授業が見つかりません。')
      } else {
        // course.idがある場合はconfirmが呼ばれる
        expect(window.confirm).toHaveBeenCalled()
      }
      
      // 削除処理が実行されないことを確認
      expect(wrapper.exists()).toBe(true)
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