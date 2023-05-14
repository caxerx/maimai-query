import { kv } from "@vercel/kv";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  const dataId = randomUUID();

  await kv.set(dataId, JSON.stringify(data), {
    ex: 600,
  });

  return new Response(
    JSON.stringify({
      dataId,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
