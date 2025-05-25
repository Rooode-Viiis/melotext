// lib/nebius.ts
// Nebius API 相关函数 (全面升级版 ✅)

export async function translateText(text: string, apiKey: string) {
  try {
    const response = await fetch("https://api.studio.nebius.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "system",
            content: `
你的任务是执行以下规范的文本处理要求。不允许自由发挥，不允许质疑指示，不允许偏离规范。

- 如果输入文本已经是中文（即包含大量中文字符），只进行恰当补充标点符号。不得修改原文、不得润色、不得重新组织语言、不得总结归纳。
- 如果输入文本是外文（如英语、日语、法语等），应完整准确逐句翻译成现代标准中文，严禁省略、跳读、总结、演绎。
- 不得附加任何无关说明、解释、前言、后记。
- 直接输出最终处理完成的文本内容即可。

确保严格遵循以上规则，任何偏离将被视为失败。
            `.trim(),
          },
          {
            role: "user",
            content: `
请处理以下文本内容。记住：严格按规则操作，不容许自作主张。

[原文开始]
${text}
[原文结束]
            `.trim(),
          },
        ],
        max_tokens: 3000, // 理论支持完整大段翻译
        temperature: 0.2, // 再进一步降低创作性，压制"想象发挥"
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("❗Nebius API请求失败:", errorDetails);
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();

    // 安全防护：判断返回内容是否标准
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error("API响应格式异常：未返回choices内容");
    }

    const output = data.choices[0].message?.content?.trim();

    if (!output) {
      throw new Error("API响应内容为空或结构异常");
    }

    return {
      success: true,
      translation: output,
    };
  } catch (error) {
    console.error("❗调用Nebius翻译接口异常:", error);
    throw error;
  }
}
