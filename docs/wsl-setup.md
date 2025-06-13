# WSL環境でのアクセス方法

## 問題：localhost:3000にアクセスできない

### 解決方法

#### 方法1: ターミナルで新しいウィンドウを開く
```bash
# 新しいターミナルウィンドウで：
cd /mnt/c/Users/ad-su/01プログラミング/02保存先/sns-operation-tool/backend
npm install
npm start
```

#### 方法2: バックグラウンドで実行
```bash
cd /mnt/c/Users/ad-su/01プログラミング/02保存先/sns-operation-tool/backend
npm install
npm start &
```

#### 方法3: WSLのIPアドレスを使用
```bash
# WSLのIPアドレスを確認
hostname -I

# 表示されたIPアドレスを使ってアクセス
# 例: http://172.24.209.103:3000
```

#### 方法4: server.jsを修正（推奨）
`backend/server.js`の最後の部分を以下に変更：

```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`📝 投稿管理ツールが利用可能です！`);
  console.log(`💡 WSL環境の場合: http://127.0.0.1:${PORT} も試してください`);
});
```

## 確認方法

1. **サーバーが起動しているか確認**
```bash
# 別のターミナルで
curl http://localhost:3000
```

2. **ポートが開いているか確認**
```bash
ps aux | grep node
netstat -tuln | grep 3000
```

3. **Windowsからアクセスする場合**
- http://localhost:3000
- http://127.0.0.1:3000
- http://[WSLのIP]:3000

## それでもアクセスできない場合

1. **Windowsファイアウォールの設定**
   - Windows Defenderファイアウォール → 詳細設定
   - 受信の規則 → 新しい規則
   - ポート3000を許可

2. **別のポートを使用**
```bash
PORT=8080 npm start
# http://localhost:8080 でアクセス
```

3. **PowerShell（管理者）でポートフォワーディング**
```powershell
# WSLのIPアドレスを確認してから実行
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=[WSL-IP]
```