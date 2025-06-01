/**
 * - 多段文本翻译器：translateWithChunks
 * - 当前使用字符长度（而非真实Token）进行分段；
 * - 每段最大约3000字符，遇句号自动分段；
 * - 每段翻译失败最多重试1次，最终如失败将返回 【本段翻译失败】；
 * 
 * ⚠️ 如果你使用的翻译API有token限制，请手动调整MAX_CHUNK_LENGTH
 */

import { translateText } from "@/lib/translate";

const MAX_CHUNK_LENGTH = 3000; 

export function splitByTokens(text: string, maxChunkLength = MAX_CHUNK_LENGTH): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const char of text) {
    current += char;

    // 如果达到了最大长度，并且遇到了适合断开的标点
    if (current.length >= maxChunkLength) {
      const lastChar = current[current.length - 1];
      if (["。", ".", "？", "！", "!", "?"].includes(lastChar)) {
        chunks.push(current.trim());
        current = "";
      }
    }
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}


export async function translateWithChunks(text: string, apiKey: string): Promise<string> {
  const chunks = splitByTokens(text);
  const totalChunks = chunks.length;

  console.log(`🧠 [multiTranslate.ts] 开始翻译 🎯`);
  console.log(`📑 原文总字符数：${text.length} 字，分成 ${totalChunks} 个段落 ⬅️`);

  if (totalChunks === 1) {
    console.log("✅ 长度适中，仅需一次翻译");
  }

  console.time("⏱️ 翻译总耗时");

  const translatedParts = await Promise.all(
    chunks.map(async (chunk, index) => {
      for (let attempt = 1; attempt <= 2; attempt++) { // 每段最多重试2次
        try {
          console.log(`--> 🎬 开始翻译第 ${index + 1} 段，第 ${attempt} 次尝试`);
          const start = Date.now();
          const result = await translateText(chunk, apiKey);
          const duration = ((Date.now() - start) / 1000).toFixed(1);
          console.log(`✅ 第 ${index + 1} 段翻译成功，用时 ${duration} 秒`);
          return result.translation.trim();
        } catch (err: any) {
          console.warn(`❌ 第 ${index + 1} 段翻译第 ${attempt} 次失败: ${err.message || err}`);
          if (attempt === 2) {
            return "【本段翻译失败】";
          }
        }
      }
      return "【本段不可达】";
    })
  );

  console.timeEnd("⏱️ 翻译总耗时");

  const finalText = translatedParts.join("\n\n").trim();
  console.log(`📦 合并完成，总翻译段数：${translatedParts.length}，最终总字符数：${finalText.length}`);

  return finalText;
}
