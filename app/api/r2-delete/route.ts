import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(req: Request) {
  const { key } = await req.json();

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
  });

  await r2.send(deleteCommand);

  return Response.json({ success: true });
}

/**
 * 🔥 删除 R2 对象
 * 假定上传至 R2 后，使用本方法通过对象 key 删除远程存储资源。
 * ⚠️ 注意：建议在转录任务完成后或文件确认被使用后再调用，避免文件过早被销毁！
 * ⚠️ 删除为不可逆操作，文件一旦删除将无法再次获取。
 */