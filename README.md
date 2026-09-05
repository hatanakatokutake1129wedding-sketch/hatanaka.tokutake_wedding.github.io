# Web招待状 | Hatanaka & Tokutake Wedding Invitation

德嵩千里・畠中翼の結婚式のデジタル招待状です。

**式日：** 2026年11月29日（日）  
**会場：** JWマリオット・ホテル東京

---

## 🌐 サイト

[hatanaka.tokutake_wedding.github.io](https://hatanaka.tokutake_wedding.github.io/)

---

## 📁 ファイル構成

```
.
├── index.html              # 招待状ページ
├── style.css               # スタイル
├── main.js                 # 機能（カウントダウン、フォーム、etc.）
├── apps-script-setup.gs    # Google Apps Script（参考）
└── README.md               # このファイル
```

### 画像アセット

背景画像など必要に応じて `assets/` フォルダに追加：

```
assets/
└── hero-night.jpg          # ヒーロー画面背景
```

---

## ✨ 機能

- **カウントダウン:** 挙式までの日時をリアルタイム表示
- **RSVP フォーム:** 出欠確認と詳細情報の収集
  - Google Sheets 連携
  - アレルギー対応確認
  - メッセージ欄
- **思い出の写真:** ゲストが写真をアップロード
- **スターアニメーション:** スクロール時の視覚効果

---

## 🔧 カスタマイズ

### RSVP エンドポイント

`main.js` の `RSVP_ENDPOINT` 定数を環境に合わせて変更してください：

```javascript
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec';
```

詳細は `apps-script-setup.gs` または `build-spec.md` を参照。

---

## 📱 ブラウザ対応

- Chrome / Edge（最新）
- Safari（iOS 14+）
- Firefox（最新）

---

## 📝 ライセンス

Personal use only.

---

**お問い合わせ:** お二人まで直接ご連絡ください
