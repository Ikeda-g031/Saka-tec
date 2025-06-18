# 🌟 Vue.js 初心者向けプロジェクト

このプロジェクトは、**プログラミング初心者**がVue.jsを学ぶために作られた、とてもシンプルなWebアプリケーションです。

## 📖 このプロジェクトについて

### 🎯 目的
- Vue.jsの基本的な仕組みを理解する
- コンポーネントという概念を学ぶ
- チーム開発の基礎を身につける

### ✨ 特徴
- **最小限の構成**: 複雑な機能は一切なし
- **JavaScript使用**: TypeScriptは使わず、理解しやすいJavaScriptのみ
- **日本語コメント**: 初心者にも親しみやすい

## 🗓️ 開発フェーズ

### **Phase 1: 基盤構築** 🏗️
- **Issue 9**: プロジェクト基盤とルーティング設定
- **Issue 10**: カレンダー表示機能
- **Issue 17**: データ保存・管理機能

### **Phase 2: 基本機能** ⚡
- **Issue 11**: 予定追加ボタンとモーダル
- **Issue 12**: 授業詳細入力フォーム
- **Issue 13**: 一般予定入力フォーム

### **Phase 3: 拡張機能** 🚀
- **Issue 14**: カスタマイズ機能（色選択）
- **Issue 15**: 繰り返し設定機能
- **Issue 16**: 通知設定機能

### **Phase 4: 仕上げ** ✨
- **Issue 18**: UI/UXの改善と仕上げ

## 📁 ファイル構成

```
simple-app/
├── index.html              # Webページの土台
├── package.json            # プロジェクトの設定ファイル
├── src/                    # プログラムのメインフォルダ
│   ├── main.js            # アプリの開始地点
│   ├── App.vue            # メインのコンポーネント
│   └── components/        # 部品置き場
│       └── HelloWorld.vue # 挨拶コンポーネント
└── vite.config.js         # ビルド設定
```

### セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd Saka-tec
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```
   **何をしているの？**: 必要なツールをダウンロードしています

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   **何をしているの？**: ローカルサーバーを起動してアプリを表示します

4. **ブラウザでアクセス**
   - http://localhost:5173 を開く


## 📝 開発ガイドライン
- feat: 新機能の追加
- fix: バグ修正
- docs: ドキュメントの更新
- style: コードフォーマットの修正
- refactor: リファクタリング
- test: テストの追加・修正
- chore: その他の変更

### ブランチ戦略
- `main`: 本番環境用
- `develop`: 開発用
- `個人名/*`: 担当者用のブランチ。後ろに具体的な内容を記入する

## 🔍 各ファイルの役割

### 📄 `index.html`
- Webページの「骨組み」
- ブラウザが最初に読み込むファイル
- `<div id="app"></div>` がVue.jsアプリが表示される場所

### ⚙️ `src/main.js`
```javascript
import { createApp } from 'vue'     // Vue.jsを読み込む
import App from './App.vue'         // メインコンポーネントを読み込む
import './assets/main.css'          // スタイルを読み込む

createApp(App).mount('#app')        // アプリを開始する
```
**たった4行！** Vue.jsアプリを起動するためのファイルです。

### 🧩 `src/App.vue`
- アプリの「メイン画面」
- Vue.jsのコンポーネントの基本的な書き方を学べる
- 3つの部分から構成：
  - `<script>`: JavaScript部分（プログラムのロジック）
  - `<template>`: HTML部分（画面の構造）
  - `<style>`: CSS部分（見た目の装飾）

### 👋 `src/components/HelloWorld.vue`
- 再利用可能な「部品」（コンポーネント）の例
- 親から「メッセージ」を受け取って表示する
- コンポーネント間のデータのやり取りを学べる

## 🎓 学習のポイント

### 🔰 初心者が理解すべきこと

1. **コンポーネントとは**
   - Webページの「部品」のようなもの
   - 一度作れば何度でも使える
   - 例：ボタン、メニュー、カードなど

2. **データの流れ**
   - 親コンポーネント → 子コンポーネントにデータを渡せる
   - `App.vue` → `HelloWorld.vue` にメッセージを渡している

3. **Vue.jsの基本構文**
   - `{{ }}`: データを表示
   - `props`: 親からデータを受け取る

### 💡 実際に試してみよう

#### 練習1: メッセージを変更
`App.vue` の8行目：
```vue
<HelloWorld msg="Welcome to Your Vue.js App" />
```
`msg="..."` の部分を好きなメッセージに変更してみましょう！

#### 練習2: 新しい文章を追加
`HelloWorld.vue` の `<template>` 部分に新しい `<p>` タグを追加してみましょう。

#### 練習3: 色を変更
`HelloWorld.vue` の `<style>` 部分で色を変更してみましょう。

## 🆘 困ったときは

### よくあるエラー

1. **「npm not found」エラー**
   - Node.jsがインストールされていません
   - [Node.js公式サイト](https://nodejs.org/)からダウンロード

2. **「ポートが使用中」エラー**
   - 別のアプリが同じポートを使用中
   - ターミナルで `Ctrl + C` を押して他のサーバーを停止

3. **画面が白い**
   - ブラウザの開発者ツール（F12）でエラーを確認
   - ファイルパスが正しいか確認

### 📚 参考資料

- [Vue.js公式ガイド](https://ja.vuejs.org/guide/)
- [JavaScript基礎](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [HTML基礎](https://developer.mozilla.org/ja/docs/Web/HTML)
- [CSS基礎](https://developer.mozilla.org/ja/docs/Web/CSS)

## 🤝 チーム開発のルール

### Gitの基本的な流れ

1. **作業開始前**
   ```bash
   git pull origin main
   ```

2. **作業後**
   ```bash
   git add .
   git commit -m "機能を追加しました"
   git push origin main
   ```

3. **コミットメッセージの例**
   - ✅ 「ボタンのクリック機能を追加」
   - ✅ 「メッセージの色を青に変更」
   - ❌ 「修正」「更新」（何を修正したかわからない）

**大切なのは**：
- 🐌 急がず、一歩ずつ学習すること
- 🤝 チームメンバーと助け合うこと  
- 💪 エラーを恐れず、たくさん試すこと

頑張って学習を続けましょう！ 🚀

---

**作成日**: 2025年6月19日
**対象**: プログラミング初心者・Vue.js初学者
**バージョン**: 1.0.0
