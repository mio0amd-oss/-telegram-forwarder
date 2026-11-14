# ربات فورواردر تلگرام — Cloudflare Workers

هر چیزی که به ربات بفرستی (متن، عکس، فیلم، فایل، ویس، استیکر...) به کانال **@lokkolloo** می‌رود.

## ۱. ربات را ادمین کانال کن
- تو تلگرام برو تو کانال `@lokkolloo` → مدیران → افزودن مدیر → ربات را اضافه کن و تیک **Post messages** را بزن.

## ۲. دیپلوی روی کلادفلر
روش راحت (داشبورد):
- برو `dash.cloudflare.com` → **Workers & Pages** → **Create** → **Worker** → کد `src/index.js` را جای کد پیش‌فرض بذار → **Deploy**.

یا با ترمینال:
```bash
npm i -g wrangler
cd telegram-forwarder-bot
npx wrangler login
npx wrangler deploy
```
آدرس ورکر می‌شود چیزی شبیه: `https://telegram-forwarder.<subdomain>.workers.dev`

## ۳. توکن را به‌صورت Secret بذار (هرگز داخل کد ننویس)
```bash
npx wrangler secret put BOT_TOKEN
```
بعد توکن ربات را پیست کن. یا از داشبورد: ورکر → **Settings** → **Variables** → **Add variable** → نوع را **Secret** بذار.

## ۴. وبهوک را ست کن
تو مرورگر این آدرس را باز کن (به‌جای `TOKEN` توکن ربات، به‌جای `WORKER_URL` آدرس ورکر):
```
https://api.telegram.org/botTOKEN/setWebhook?url=https://WORKER_URL/
```
اگر جواب `{"ok":true}` بود یعنی وصل شد.

## ۵. (اختیاری) فقط خودت بتونی استفاده کنی
آیدی عددی تلگرامت را از `@userinfobot` بگیر و به‌عنوان Secret بذار:
```bash
npx wrangler secret put ALLOWED_USER_ID
```
اگر این را نزنی، هر کسی که ربات را پیدا کند می‌تواند به کانال بفرستد.

## ۶. تست
به ربات یه پیام بده — باید تو کانال بیاد.

## نکته‌ها
- اگر کانال خصوصی است، به‌جای `@lokkolloo` باید آیدی عددی کانال (مثل `-1001234567890`) را تو کد بذاری. آیدی را می‌شود با فوروارد کردن یه پست کانال به `@getmyid_bot` گرفت.
- برای قطع وبهوک: `https://api.telegram.org/botTOKEN/deleteWebhook`
