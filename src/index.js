// Telegram forwarder bot — Cloudflare Worker
// هر پیامی که به ربات می‌رسد را به کانال @lokkolloo می‌فرستد.
// توکن فقط از Secret خوانده می‌شود و هرگز داخل کد نیست.

const CHANNEL = "@lokkolloo";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Telegram forwarder bot is running.", { status: 200 });
    }
    try {
      const update = await request.json();
      await handleUpdate(update, env);
    } catch (e) {
      // خطا را قورت بده تا تلگرام وبهوک را قطع نکند
    }
    return new Response("OK", { status: 200 });
  },
};

async function tg(token, method, body) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function handleUpdate(update, env) {
  const token = env.BOT_TOKEN;
  if (!token) return;

  // فقط پیام‌های چت خصوصی؛ پست‌های کانال نادیده گرفته می‌شوند تا لوپ درست نشود
  const msg = update.message;
  if (!msg || !msg.from || msg.from.is_bot) return;

  // اگر ALLOWED_USER_ID تنظیم شده، فقط از همان کاربر قبول کن
  if (env.ALLOWED_USER_ID && String(msg.from.id) !== String(env.ALLOWED_USER_ID)) {
    await tg(token, "sendMessage", {
      chat_id: msg.chat.id,
      text: "⛔️ این ربات خصوصی است.",
    });
    return;
  }

  if (msg.text === "/start") {
    await tg(token, "sendMessage", {
      chat_id: msg.chat.id,
      text: "سلام! هر چیزی (متن، عکس، فیلم، فایل، ویس...) بفرستی، می‌ره تو کانال @lokkolloo 📢",
    });
    return;
  }

  // کپی پیام به کانال (بدون برچسب «فوروارد شده»)
  const copied = await tg(token, "copyMessage", {
    chat_id: CHANNEL,
    from_chat_id: msg.chat.id,
    message_id: msg.message_id,
  });

  // اگر کپی نشد (بعضی نوع پیام‌ها)، فوروارد معمولی را امتحان کن
  if (!copied || !copied.ok) {
    await tg(token, "forwardMessage", {
      chat_id: CHANNEL,
      from_chat_id: msg.chat.id,
      message_id: msg.message_id,
    });
  }
}
