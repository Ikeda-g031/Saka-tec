# Saka-tec

授業スケジュール管理システム - Vue.js製のWebアプリケーション

## 概要

Saka-tecは、学生が授業や予定を効率的に管理できるWebアプリケーションです。時間割の表示、授業情報の編集、授業以外の予定登録などの機能を提供しています。

## 主な機能

- **時間割表示**: 週単位での授業スケジュール表示
- **授業情報管理**: 授業名、教員、教室、単位数等の詳細情報管理
- **予定追加**: 授業および授業以外の予定登録
- **カスタマイズ**: セルの色分け、繰り返し設定
- **レスポンシブデザイン**: モバイルデバイス対応

## 技術スタック

- **フロントエンド**: Vue.js 3
- **ルーティング**: Vue Router
- **ビルドツール**: Vite
- **スタイリング**: CSS3, Flexbox
- **開発環境**: Node.js, npm

## プロジェクト構成

```
Saka-tec/
├── index.html              # エントリーポイント
├── package.json            # 依存関係設定
├── vite.config.js         # Vite設定
├── public/
│   └── favicon.ico        # ファビコン
└── src/
    ├── main.js            # Vue.jsアプリケーションエントリー
    ├── App.vue            # ルートコンポーネント
    ├── router.js          # ルーティング設定
    ├── assets/            # 静的ファイル
    │   ├── base.css
    │   ├── main.css
    │   └── logo.svg
    ├── components/        # Vueコンポーネント
    │   ├── HomeScreen.vue
    │   ├── Classinfoedit.vue
    │   ├── Jugyogai.vue
    │   ├── SelectSchedule.vue
    │   └── ClassDetailViewScreen.vue
    └── services/          # ビジネスロジック
        └── database.js
```

## インストール・セットアップ

### 前提条件
- Node.js 16.0以上
- npm 7.0以上

### インストール手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/Ikeda-g031/Saka-tec.git
   cd Saka-tec
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

4. **ブラウザでアクセス**
   - http://localhost:5173


## 使用方法

### 基本操作

1. **時間割表示**: ホーム画面で現在の週の授業スケジュールを表示
2. **授業追加**: 「授業以外追加」ボタンから新しい授業を登録
3. **予定追加**: 授業以外の予定を登録
4. **詳細表示**: 授業セルをクリックして詳細情報を確認

### 機能詳細

- **時間割管理**: 月曜日から金曜日、1限から7限の時間割管理
- **授業情報**: 授業名、教員名、教室、単位数、シラバスURL等
- **色分け**: セルの背景色で授業を分類
- **繰り返し設定**: 毎週・隔週の授業設定

## 開発情報

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

#ルーティングをインストール
npm install vue-router@4

```

### 開発ガイドライン

#### コミットメッセージ規約
- `feat`: 新機能の追加
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメントの更新
- `style`: コードフォーマットの修正
- `test`: テストの追加・修正
- `chore`: その他の変更
- `add`: 小さな追加

#### ブランチ戦略
- `main`: 本番環境用
- `develop`: 開発統合用
- `それぞれの名前`:それぞれの作成場所

#### コーディング規約
- 日本語コメント推奨
- エラーハンドリングの実装必須

### 報告・問題

バグ報告や機能リクエストは、[Issues](https://github.com/Ikeda-g031/Saka-tec/issues) でお知らせください。

## 作成者

- **開発チーム**: サカテック
- **プロジェクト管理者**: [Ikeda-g031](https://github.com/Ikeda-g031)

## 更新履歴

---

**作成日**: 2025年6月19日  
**最終更新**: 2025年7月8日  
**バージョン**: 1.0.0
