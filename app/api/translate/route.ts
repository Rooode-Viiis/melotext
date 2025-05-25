// app/api/translate/route.ts

import { NextResponse } from "next/server"
import { translateWithChunks } from "@/lib/multiTranslate"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body
    const apiKey = process.env.NEBIUS_API_KEY

    if (!text || !apiKey) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const resultText = await translateWithChunks(text, apiKey)

    return NextResponse.json({
      success: true,
      translation: resultText,
    })
  } catch (error: any) {
    console.error("Translation route error:", error)
    return NextResponse.json({ error: `翻译服务错误: ${error.message}` }, { status: 500 })
  }
}
