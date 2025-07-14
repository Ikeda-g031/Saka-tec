#!/usr/bin/env node

/**
 * 初心者向けテスト実行スクリプト
 * 
 * 使用方法:
 * node scripts/run-tests.cjs          # 全テスト実行
 * node scripts/run-tests.cjs basic    # 基本テストのみ実行
 * node scripts/run-tests.cjs watch    # 監視モードで実行
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 色付きのコンソール出力
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function showHelp() {
  log('🎯 テスト実行スクリプト', 'blue')
  log('')
  log('使用方法:', 'yellow')
  log('  node scripts/run-tests.cjs          # 全テスト実行', 'green')
  log('  node scripts/run-tests.cjs basic    # 基本テストのみ実行', 'green')
  log('  node scripts/run-tests.cjs watch    # 監視モードで実行', 'green')
  log('  node scripts/run-tests.cjs ui       # UI付きテスト実行', 'green')
  log('  node scripts/run-tests.cjs help     # このヘルプを表示', 'green')
  log('')
  log('📝 テストファイルの場所:', 'yellow')
  log('  test/basic.test.js                 # 基本テスト', 'green')
  log('  test/services/database.test.js     # データベーステスト', 'green')
  log('  test/components/HomeScreen.test.js # コンポーネントテスト', 'green')
}

function runCommand(command) {
  try {
    const result = execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    return true
  } catch (error) {
    log(`❌ コマンド実行エラー: ${command}`, 'red')
    return false
  }
}

function checkDependencies() {
  log('🔍 依存関係を確認中...', 'blue')
  
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.jsonが見つかりません', 'red')
    return false
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const hasVitest = packageJson.devDependencies && packageJson.devDependencies.vitest
  
  if (!hasVitest) {
    log('⚠️  Vitestがインストールされていません', 'yellow')
    log('    npm install --save-dev vitest を実行してください', 'yellow')
    return false
  }
  
  log('✅ 依存関係は正常です', 'green')
  return true
}

function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'all'
  
  log('🚀 テスト実行スクリプトを開始します', 'blue')
  log('')
  
  // ヘルプ表示
  if (command === 'help' || command === '--help' || command === '-h') {
    showHelp()
    return
  }
  
  // 依存関係チェック
  if (!checkDependencies()) {
    process.exit(1)
  }
  
  log('')
  
  // コマンド実行
  let success = false
  
  switch (command) {
    case 'basic':
      log('📋 基本テストを実行します...', 'blue')
      success = runCommand('npm test test/basic.test.js')
      break
      
    case 'watch':
      log('👀 監視モードでテストを実行します...', 'blue')
      log('    ファイルを変更すると自動でテストが実行されます', 'yellow')
      log('    終了するには Ctrl+C を押してください', 'yellow')
      success = runCommand('npm run test:watch')
      break
      
    case 'ui':
      log('🖥️  UI付きテストを実行します...', 'blue')
      log('    ブラウザが開いてテスト結果が表示されます', 'yellow')
      success = runCommand('npm run test:ui')
      break
      
    case 'all':
    default:
      log('📋 全テストを実行します...', 'blue')
      success = runCommand('npm test')
      break
  }
  
  log('')
  
  if (success) {
    log('✅ テストが正常に完了しました！', 'green')
  } else {
    log('❌ テスト実行中にエラーが発生しました', 'red')
    log('')
    log('🔧 トラブルシューティング:', 'yellow')
    log('  1. npm install を実行して依存関係を確認', 'green')
    log('  2. エラーメッセージを確認', 'green')
    log('  3. チームメンバーに相談', 'green')
    process.exit(1)
  }
}

// スクリプト実行
if (require.main === module) {
  main()
} 