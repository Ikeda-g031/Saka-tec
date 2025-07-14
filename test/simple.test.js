import { describe, it, expect } from 'vitest'

describe('基本的なテスト', () => {
  it('数値の加算が正しく動作すること', () => {
    expect(1 + 1).toBe(2)
  })

  it('文字列の結合が正しく動作すること', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World')
  })

  it('配列の長さが正しく取得できること', () => {
    const arr = [1, 2, 3]
    expect(arr.length).toBe(3)
  })
}) 