# テスト実行ガイド（初心者向け）

## 🎯 このガイドの目的
このガイドは、プログラミング初心者の方が簡単にテストを実行できるように作成されました。

## 📋 テスト実行の手順

### 1. 基本的なテストを実行する

```bash
# 基本的なテストを実行
npm test
```

### 2. 特定のテストファイルを実行する

```bash
# 基本テストのみ実行
npm test test/basic.test.js

# データベーステストのみ実行
npm test test/services/database.test.js
```

### 3. テストを監視モードで実行する（推奨）

```bash
# ファイルの変更を監視して自動でテスト実行
npm run test:watch
```

### 4. テスト結果を詳しく見る

```bash
# テスト結果をブラウザで表示
npm run test:ui
```

## 📝 テストの書き方

### 基本的なテストの構造

```javascript
import { describe, it, expect } from 'vitest'

// テスト対象の関数
function myFunction(input) {
  return input * 2
}

// テストの書き方
describe('myFunctionのテスト', () => {
  it('入力値が2倍になって返されること', () => {
    // 準備（Arrange）
    const input = 5
    const expected = 10
    
    // 実行（Act）
    const result = myFunction(input)
    
    // 確認（Assert）
    expect(result).toBe(expected)
  })
})
```

### よく使うテストの書き方

| テスト内容 | 書き方 | 例 |
|-----------|--------|-----|
| 値が等しい | `expect(actual).toBe(expected)` | `expect(2 + 2).toBe(4)` |
| 配列に含まれる | `expect(array).toContain(item)` | `expect(['a', 'b']).toContain('a')` |
| エラーが発生 | `expect(() => func()).toThrow()` | `expect(() => divide(1, 0)).toThrow()` |
| 真偽値 | `expect(value).toBeTruthy()` | `expect(user.isActive).toBeTruthy()` |

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 問題1: テストが実行されない
**解決方法:**
```bash
# 依存関係を再インストール
npm install

# テストを再実行
npm test
```

#### 問題2: テストが失敗する
**解決方法:**
1. エラーメッセージを確認
2. 期待値と実際の値を比較
3. テスト対象のコードを確認

#### 問題3: モジュールが見つからない
**解決方法:**
```bash
# 必要なパッケージをインストール
npm install --save-dev vitest @vue/test-utils
```

## 📊 テスト結果の見方

### 成功したテスト
```
✓ 基本的な計算テスト (3)
✓ add関数のテスト (2)
✓ multiply関数のテスト (2)
```

### 失敗したテスト
```
✗ divide関数のテスト (1)
  Expected 5 but received 2.5
```

## 🎯 次のステップ

1. **基本テストを実行**: `npm test test/basic.test.js`
2. **自分のテストを作成**: 既存のテストを参考に新しいテストを書く
3. **テストを実行**: 作成したテストを実行して結果を確認
4. **改善**: 失敗したテストがあれば修正する

## 💡 ヒント

- テストは小さく、シンプルに書く
- テスト名は何をテストしているかが分かるように書く
- エラーが出たら慌てずに、エラーメッセージをよく読む
- 分からないことがあれば、チームメンバーに相談する

## 📞 サポート

テストで困ったことがあれば、以下の方法でサポートを受けられます：

1. このガイドを再確認
2. チームメンバーに相談
3. エラーメッセージをコピーして共有 