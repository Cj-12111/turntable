function json(o, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { "content-type": "application/json" },
  });
}
const DEFAULT_PASS = "5278";

// GET /code/password -> 当前管理员密码（全网共享）
export async function onRequestGet(context) {
  const kv = context.env.CODE_KV;
  let password = await kv.get("password");
  if (!password) {
    password = DEFAULT_PASS;
    await kv.put("password", password);
  }
  return json({ password });
}

// POST /code/password -> 设置新管理员密码
export async function onRequestPost(context) {
  const kv = context.env.CODE_KV;
  try {
    const body = await context.request.json();
    const np = body && typeof body.password === "string" ? body.password.trim() : "";
    if (np.length >= 4) {
      await kv.put("password", np);
      return json({ password: np });
    }
    return json({ error: "too short" }, 400);
  } catch (e) {
    return json({ error: "bad request" }, 400);
  }
}
