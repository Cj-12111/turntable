function genCode() {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return String(a[0] % 1000000).padStart(6, "0");
}
function json(o, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// GET /code  -> 当前抽奖码（全网共享）
export async function onRequestGet(context) {
  const kv = context.env.CODE_KV;
  let code = await kv.get("code");
  if (!code) {
    code = genCode();
    await kv.put("code", code);
  }
  return json({ code });
}

// POST /code -> 换一个新抽奖码
export async function onRequestPost(context) {
  const kv = context.env.CODE_KV;
  const code = genCode();
  await kv.put("code", code);
  return json({ code });
}
