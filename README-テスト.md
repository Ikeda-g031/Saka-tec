# 🧪 テスト実行ガイド（初心者向け）

## 🎯 このガイドについて

このガイドは、プログラミング初心者の方が簡単にテストを実行できるように作成されました。
複雑な設定は不要で、コピー&ペーストでテストを実行できます。

## 🚀 クイックスタート

### 1. 基本テストを実行する

```bash
# 最も簡単な方法
node scripts/run-tests.cjs basic
```

### 2. 全テストを実行する

```bash
# 全てのテストを実行
node scripts/run-tests.cjs
```

### 3. テストを監視モードで実行する（推奨）

```bash
# ファイルを変更すると自動でテストが実行される
node scripts/run-tests.cjs watch
```

## 📋 テスト実行コマンド一覧

| コマンド | 説明 | 使用場面 |
|----------|------|----------|
| `node scripts/run-tests.cjs` | 全テスト実行 | リリース前の最終確認 |
| `node scripts/run-tests.cjs basic` | 基本テストのみ | 学習・練習用 |
| `node scripts/run-tests.cjs watch` | 監視モード | 開発中（推奨） |
| `node scripts/run-tests.cjs ui` | UI付きテスト | 詳細確認用 |
| `node scripts/run-tests.cjs help` | ヘルプ表示 | 使い方を確認 |

## 📝 テスト結果の見方

### ✅ 成功したテスト
```
✓ 基本的な計算テスト > add関数のテスト > 2 + 3 = 5 になること
✓ 配列のテスト > 配列の長さが正しく取得できること
```

### ❌ 失敗したテスト
```
✗ divide関数のテスト > 0で割るとエラーが発生すること
  Expected 5 but received 2.5
```

## 🔧 トラブルシューティング

### 問題1: コマンドが見つからない
**解決方法:**
```bash
# プロジェクトディレクトリに移動
cd Saka-tec

# 依存関係をインストール
npm install
```

### 問題2: テストが失敗する
**解決方法:**
1. エラーメッセージを確認
2. 期待値と実際の値を比較
3. チームメンバーに相談

### 問題3: モジュールが見つからない
**解決方法:**
```bash
# 必要なパッケージをインストール
npm install --save-dev vitest @vue/test-utils
```

## 📚 テストの書き方（参考）

### 基本的なテストの構造

```javascript
import { describe, it, expect } from 'vitest'

// テスト対象の関数
function add(a, b) {
  return a + b
}

// テストの書き方
describe('add関数のテスト', () => {
  it('2 + 3 = 5 になること', () => {
    // 準備（Arrange）
    const input1 = 2
    const input2 = 3
    const expected = 5
    
    // 実行（Act）
    const result = add(input1, input2)
    
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

## 📁 テストファイルの場所

```
Saka-tec/
├── test/
│   ├── basic.test.js              # 基本テスト（学習用）
│   ├── services/
│   │   └── database.test.js       # データベーステスト
│   └── components/
│       └── HomeScreen.test.js     # コンポーネントテスト
├── scripts/
│   └── run-tests.cjs              # テスト実行スクリプト
└── docs/
    └── 単体テスト手順書.md        # 詳細な手順書
```

## 🎯 学習のステップ

### Step 1: 基本テストを実行
```bash
node scripts/run-tests.cjs basic
```

### Step 2: テストの書き方を学ぶ
- `test/basic.test.js` を参考にする
- 簡単な関数を作ってテストを書く

### Step 3: 実際のテストを作成
- 既存のテストを参考にする
- 小さなテストから始める

### Step 4: テストを実行・改善
- 作成したテストを実行
- 失敗したテストを修正

## 💡 ヒント

- **テストは小さく、シンプルに書く**
- **テスト名は何をテストしているかが分かるように書く**
- **エラーが出たら慌てずに、エラーメッセージをよく読む**
- **分からないことがあれば、チームメンバーに相談する**

## 📞 サポート

テストで困ったことがあれば、以下の方法でサポートを受けられます：

1. **このガイドを再確認**
2. **チームメンバーに相談**
3. **エラーメッセージをコピーして共有**

## 🎉 次のステップ

1. **基本テストを実行**: `node scripts/run-tests.cjs basic`
2. **テストの書き方を学ぶ**: `test/basic.test.js` を参考にする
3. **自分のテストを作成**: 既存のテストを参考に新しいテストを書く
4. **テストを実行**: 作成したテストを実行して結果を確認
5. **改善**: 失敗したテストがあれば修正する

---

**🎯 目標**: テストを書くことに慣れて、コードの品質を向上させましょう！ 