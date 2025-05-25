import { NextResponse } from "next/server"
import { transcribeAudio } from "@/lib/assemblyai"

// ✅ 允许的音频 MIME 类型白名单
const allowedMimeTypes = [
  "audio/mpeg",   // .mp3
  "audio/wav",    // .wav
  "audio/flac",   // .flac
  "audio/mp4",    // .m4a
  "audio/x-m4a",  // .m4a (变体)
]

// ✅ 文件大小限制（50MB）
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

/**
 * 获取文件大小和类型（用于验证）
 */
async function getFileMetadata(url: string): Promise<{ size: number; contentType: string } | null> {
  try {
    const res = await fetch(url, { method: "HEAD" })
    if (!res.ok) return null

    const size = parseInt(res.headers.get("content-length") || "0", 10)
    const contentType = res.headers.get("content-type") || ""

    return { size, contentType }
  } catch (err) {
    console.error("⚠️ 获取文件信息失败（HEAD 请求）:", err)
    return null
  }
}

/**
 * 判断是否来自允许的音频链接来源
 */
function isAllowedAudioUrl(audioUrl: string): boolean {
  try {
    const url = new URL(audioUrl)
    const host = url.hostname
    const path = url.pathname

    const isGitHubRaw = host === "raw.githubusercontent.com"
    const isGitHubPathRaw = host === "github.com" && path.includes("/raw/")
    const allowedR2Host = new URL(process.env.R2_PUBLIC_DOMAIN!).hostname
    const isMyR2 = host === allowedR2Host

    return isGitHubRaw || isGitHubPathRaw || isMyR2
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    // 解析请求体
    let body
    try {
      body = await request.json()
    } catch (err) {
      console.error("❌ 无法解析 JSON 请求:", err)
      return NextResponse.json({ error: "无法解析请求，请提交有效 JSON 格式" }, { status: 400 })
    }

    const { audioUrl, speechModel, languageCode } = body
    const apiKey = process.env.ASSEMBLYAI_API_KEY

    console.log("🧭 Audio URL:", audioUrl)
    console.log("🔐 API Key 提供状态:", !!apiKey)

    if (!audioUrl || !apiKey) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    // ✅ 来源 URL 检查
    if (!isAllowedAudioUrl(audioUrl)) {
      return NextResponse.json(
        { error: "当前仅支持 GitHub Raw 链接或本服务器上传的 R2 公链链接。" },
        { status: 403 },
      )
    }

    // ✅ 读取文件 metadata
    const metadata = await getFileMetadata(audioUrl)
    if (!metadata) {
      return NextResponse.json(
        { error: "无法访问音频链接，请确保链接有效并允许公开访问。" },
        { status: 400 },
      )
    }

    const { size, contentType } = metadata
    console.log("📦 音频文件 => 大小:", size, "类型:", contentType)

    // ✅ 大小限制验证
    if (size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `文件过大：${(size / (1024 * 1024)).toFixed(2)}MB，当前限制为 50MB`,
        },
        { status: 400 }
      )
    }

    // ✅ 类型限制验证
    if (!allowedMimeTypes.includes(contentType)) {
      return NextResponse.json(
        {
          error: `文件类型不被支持（${contentType}），请上传 mp3、wav、flac 或 m4a 格式的音频文件。`,
        },
        { status: 400 }
      )
    }

    // ✅ 发起转录请求
    const result = await transcribeAudio(audioUrl, apiKey, speechModel, languageCode)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("❗️转录服务错误:", {
      message: error.message,
      stack: error.stack,
      error,
    })
    return NextResponse.json({ error: `转录服务出错: ${error.message}` }, { status: 500 })
  }
}
