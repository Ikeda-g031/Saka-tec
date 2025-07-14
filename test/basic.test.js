/**
 * 初心者向け基本テスト
 * 
 * このファイルは、テストの書き方を学ぶためのサンプルです。
 * 実際のテストは、このファイルを参考にして作成してください。
 */

import { describe, it, expect } from 'vitest'

// 基本的な計算関数（テスト対象）
function add(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('0で割ることはできません')
  }
  return a / b
}

// テストの書き方の例
describe('基本的な計算テスト', () => {
  
  // 足し算のテスト
  describe('add関数のテスト', () => {
    it('2 + 3 = 5 になること', () => {
      // 期待値
      const expected = 5
      // 実際の結果
      const result = add(2, 3)
      // 結果を確認
      expect(result).toBe(expected)
    })

    it('負の数の足し算が正しく動作すること', () => {
      expect(add(-1, 5)).toBe(4)
      expect(add(3, -2)).toBe(1)
    })
  })

  // 掛け算のテスト
  describe('multiply関数のテスト', () => {
    it('3 × 4 = 12 になること', () => {
      expect(multiply(3, 4)).toBe(12)
    })

    it('0との掛け算が正しく動作すること', () => {
      expect(multiply(5, 0)).toBe(0)
    })
  })

  // 割り算のテスト
  describe('divide関数のテスト', () => {
    it('10 ÷ 2 = 5 になること', () => {
      expect(divide(10, 2)).toBe(5)
    })

    it('0で割るとエラーが発生すること', () => {
      // エラーが発生することを確認
      expect(() => divide(10, 0)).toThrow('0で割ることはできません')
    })
  })
})

// 配列のテスト例
describe('配列のテスト', () => {
  it('配列の長さが正しく取得できること', () => {
    const fruits = ['りんご', 'みかん', 'バナナ']
    expect(fruits.length).toBe(3)
  })

  it('配列に要素が含まれていることを確認できること', () => {
    const fruits = ['りんご', 'みかん', 'バナナ']
    expect(fruits).toContain('りんご')
    expect(fruits).not.toContain('ぶどう')
  })
})

// 文字列のテスト例
describe('文字列のテスト', () => {
  it('文字列の結合が正しく動作すること', () => {
    const firstName = '田中'
    const lastName = '太郎'
    const fullName = firstName + ' ' + lastName
    expect(fullName).toBe('田中 太郎')
  })

  it('文字列の長さが正しく取得できること', () => {
    const text = 'こんにちは'
    expect(text.length).toBe(5)
  })
}) 