/**
 * 単体テストスタブ集
 * 
 * 役割：
 * - 外部依存の代替実装を提供
 * - テスト実行時の予測可能な動作を保証
 * - 実際のデータベースやAPIを使わずにテスト実行
 * 
 * スタブが必要な理由：
 * 1. 外部システムの不安定性を排除
 * 2. テスト実行速度の向上
 * 3. 異常ケースの再現性向上
 * 4. テスト環境の独立性確保
 */

import { vi } from 'vitest'

/**
 * IndexedDBスタブ
 * 
 * 実際のIndexedDBの代わりにインメモリで動作する
 */
export class IndexedDBStub {
  constructor() {
    this.databases = new Map()
    this.isOpen = false
  }

  open(name, version) {
    return new Promise((resolve) => {
      if (!this.databases.has(name)) {
        this.databases.set(name, {
          version,
          objectStores: new Map(),
          data: new Map()
        })
      }
      
      const db = this.databases.get(name)
      this.isOpen = true
      
      resolve({
        result: {
          name,
          version: db.version,
          objectStoreNames: Array.from(db.objectStores.keys()),
          createObjectStore: (storeName, options) => {
            db.objectStores.set(storeName, {
              keyPath: options?.keyPath,
              autoIncrement: options?.autoIncrement,
              data: new Map()
            })
            return {
              createIndex: vi.fn()
            }
          },
          transaction: (storeNames, mode) => {
            return new TransactionStub(db, storeNames, mode)
          }
        }
      })
    })
  }

  deleteDatabase(name) {
    return new Promise((resolve) => {
      this.databases.delete(name)
      resolve()
    })
  }
}

/**
 * トランザクションスタブ
 */
class TransactionStub {
  constructor(db, storeNames, mode) {
    this.db = db
    this.storeNames = Array.isArray(storeNames) ? storeNames : [storeNames]
    this.mode = mode
  }

  objectStore(name) {
    return new ObjectStoreStub(this.db.objectStores.get(name))
  }
}

/**
 * オブジェクトストアスタブ
 */
class ObjectStoreStub {
  constructor(store) {
    this.store = store
    this.autoIncrementId = 1
  }

  add(value) {
    return new Promise((resolve) => {
      const id = this.autoIncrementId++
      this.store.data.set(id, { ...value, id })
      resolve({ result: id })
    })
  }

  put(value) {
    return new Promise((resolve) => {
      const id = value.id || this.autoIncrementId++
      this.store.data.set(id, { ...value, id })
      resolve({ result: id })
    })
  }

  get(id) {
    return new Promise((resolve) => {
      const value = this.store.data.get(id)
      resolve({ result: value })
    })
  }

  delete(id) {
    return new Promise((resolve) => {
      this.store.data.delete(id)
      resolve()
    })
  }

  getAll() {
    return new Promise((resolve) => {
      const values = Array.from(this.store.data.values())
      resolve({ result: values })
    })
  }

  clear() {
    return new Promise((resolve) => {
      this.store.data.clear()
      resolve()
    })
  }
}

/**
 * Dexieスタブ
 */
export class DexieStub {
  constructor(name) {
    this.name = name
    this.verno = 1
    this.tables = new Map()
  }

  version(versionNumber) {
    this.verno = versionNumber
    return {
      stores: (schema) => {
        Object.entries(schema).forEach(([tableName, definition]) => {
          this.tables.set(tableName, new TableStub(tableName, definition))
          this[tableName] = this.tables.get(tableName)
        })
        return this
      }
    }
  }

  open() {
    return Promise.resolve()
  }
}

/**
 * テーブルスタブ
 */
class TableStub {
  constructor(name, schema) {
    this.name = name
    this.schema = schema
    this.data = new Map()
    this.autoIncrementId = 1
  }

  add(value) {
    return new Promise((resolve) => {
      const id = this.autoIncrementId++
      this.data.set(id, { ...value, id })
      resolve(id)
    })
  }

  update(id, changes) {
    return new Promise((resolve) => {
      const existing = this.data.get(id)
      if (existing) {
        this.data.set(id, { ...existing, ...changes })
        resolve(1)
      } else {
        resolve(0)
      }
    })
  }

  delete(id) {
    return new Promise((resolve) => {
      this.data.delete(id)
      resolve()
    })
  }

  toArray() {
    return Promise.resolve(Array.from(this.data.values()))
  }

  where(criteria) {
    return {
      first: () => {
        const values = Array.from(this.data.values())
        const found = values.find(item => {
          return Object.entries(criteria).every(([key, value]) => 
            item[key] === value
          )
        })
        return Promise.resolve(found)
      }
    }
  }

  clear() {
    return new Promise((resolve) => {
      this.data.clear()
      resolve()
    })
  }

  bulkAdd(values) {
    return new Promise((resolve) => {
      values.forEach(value => {
        const id = this.autoIncrementId++
        this.data.set(id, { ...value, id })
      })
      resolve()
    })
  }
}

/**
 * Vue Routerスタブ
 */
export const createRouterStub = () => ({
  push: vi.fn().mockResolvedValue(),
  replace: vi.fn().mockResolvedValue(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      query: {},
      params: {},
      meta: {}
    }
  },
  beforeEach: vi.fn(),
  afterEach: vi.fn()
})

/**
 * Vueコンポーネントスタブ
 */
export const createComponentStub = (name) => ({
  name,
  template: `<div class="stub-${name.toLowerCase()}">{{ name }} Stub</div>`,
  props: {},
  data: () => ({}),
  methods: {},
  mounted: vi.fn(),
  created: vi.fn(),
  beforeDestroy: vi.fn()
})

/**
 * APIスタブ
 */
export class APIStub {
  constructor() {
    this.responses = new Map()
    this.requestHistory = []
  }

  // レスポンスを事前に設定
  setResponse(endpoint, response) {
    this.responses.set(endpoint, response)
  }

  // HTTP GETリクエストのスタブ
  get(endpoint) {
    return new Promise((resolve, reject) => {
      this.requestHistory.push({ method: 'GET', endpoint, timestamp: Date.now() })
      
      const response = this.responses.get(endpoint)
      if (response) {
        if (response.error) {
          reject(response.error)
        } else {
          resolve(response.data)
        }
      } else {
        resolve({ data: null, status: 404 })
      }
    })
  }

  // HTTP POSTリクエストのスタブ
  post(endpoint, data) {
    return new Promise((resolve, reject) => {
      this.requestHistory.push({ method: 'POST', endpoint, data, timestamp: Date.now() })
      
      const response = this.responses.get(endpoint)
      if (response) {
        if (response.error) {
          reject(response.error)
        } else {
          resolve(response.data)
        }
      } else {
        resolve({ data: { id: Math.random() }, status: 201 })
      }
    })
  }

  // リクエスト履歴を取得
  getRequestHistory() {
    return this.requestHistory
  }

  // リクエスト履歴をクリア
  clearRequestHistory() {
    this.requestHistory = []
  }
}

/**
 * 日付関連のスタブ
 */
export class DateStub {
  constructor(fixedDate = '2024-01-01T00:00:00.000Z') {
    this.fixedDate = new Date(fixedDate)
  }

  now() {
    return this.fixedDate.getTime()
  }

  getCurrentDate() {
    return new Date(this.fixedDate)
  }

  addDays(days) {
    const newDate = new Date(this.fixedDate)
    newDate.setDate(newDate.getDate() + days)
    return newDate
  }

  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
  }
}

/**
 * ローカルストレージスタブ
 */
export class LocalStorageStub {
  constructor() {
    this.store = new Map()
  }

  getItem(key) {
    return this.store.get(key) || null
  }

  setItem(key, value) {
    this.store.set(key, String(value))
  }

  removeItem(key) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }

  get length() {
    return this.store.size
  }

  key(index) {
    const keys = Array.from(this.store.keys())
    return keys[index] || null
  }
}

/**
 * コンソールスタブ
 */
export class ConsoleStub {
  constructor() {
    this.logs = []
    this.errors = []
    this.warnings = []
  }

  log(...args) {
    this.logs.push(args)
  }

  error(...args) {
    this.errors.push(args)
  }

  warn(...args) {
    this.warnings.push(args)
  }

  clear() {
    this.logs = []
    this.errors = []
    this.warnings = []
  }

  getLogs() {
    return this.logs
  }

  getErrors() {
    return this.errors
  }

  getWarnings() {
    return this.warnings
  }
}

// グローバルなスタブインスタンス
export const globalStubs = {
  indexedDB: new IndexedDBStub(),
  localStorage: new LocalStorageStub(),
  console: new ConsoleStub(),
  api: new APIStub(),
  date: new DateStub()
}

// スタブを適用する関数
export const applyGlobalStubs = () => {
  global.indexedDB = globalStubs.indexedDB
  global.localStorage = globalStubs.localStorage
  global.console = globalStubs.console
  global.Date.now = globalStubs.date.now.bind(globalStubs.date)
}

// スタブをリセットする関数
export const resetGlobalStubs = () => {
  Object.values(globalStubs).forEach(stub => {
    if (stub.clear) {
      stub.clear()
    }
  })
} 