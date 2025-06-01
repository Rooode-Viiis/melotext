"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Upload, AlertCircle, FileAudio } from "lucide-react";

interface FileUploaderProps {
  onFileUpload: (url: string) => void;
  maxSize?: number; // in MB
}

export function FileUploader({ onFileUpload, maxSize = 300 }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isUploading && uploadProgress < 85) {
      interval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 3 + 1;
          const nextProgress = prev + increment;
          return Math.min(nextProgress, 85);
        });
      }, 800);
    }

    return () => interval && clearInterval(interval);
  }, [isUploading, uploadProgress]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setFileName(file.name);

    // ✅ 限制文件扩展名
    const allowedExtensions = ["mp3", "wav", "flac", "m4a"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      setError("仅支持 MP3、WAV、FLAC、M4A 格式的音频文件");
      setIsUploading(false);
      return;
    }

    // ✅ 限制文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大于 ${maxSize}MB，请重新选择`);
      setIsUploading(false);
      return;
    }

    try {
      const uploadResp = await fetch("/api/r2-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, filetype: file.type }),
      });

      if (!uploadResp.ok) throw new Error("无法获取上传链接");

      const { url, publicUrl, key } = await uploadResp.json();

      setUploadProgress(20);

      const r2Upload = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!r2Upload.ok) throw new Error(`上传失败：${r2Upload.statusText}`);

      setUploadProgress(100);
      onFileUpload(publicUrl);

      // 自动删除定时器 (30min)
      setTimeout(async () => {
        await fetch("/api/r2-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
        console.log("自动删除成功 ✅");
      }, 30 * 60 * 1000);
    } catch (err: any) {
      setError("上传失败：" + err.message);
      setUploadProgress(0);
      console.error("[上传失败❌]:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        handleFileChange({ target: { files: e.dataTransfer.files } } as any);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer 
          ${isDragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"} 
          glass-input backdrop-blur-md transition-all duration-200
          ${isUploading ? "opacity-70 pointer-events-none" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {fileName ? (
              <>
                <FileAudio className="w-8 h-8 mb-2 text-blue-500" />
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-300 font-medium">{fileName}</p>
                <p className="text-xs text-blue-500">点击更换文件</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-300 font-medium">点击上传</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  支持格式: MP3 / WAV / M4A / FLAC（最大 {maxSize}MB）
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  上传音频5分钟后自动删除
                </p>
              </>
            )}
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".mp3,.wav,.flac,.m4a"
            onChange={handleFileChange}
            disabled={isUploading}
            ref={fileInputRef}
          />
        </label>
      </div>

      {isUploading && (
        <div className="w-full mt-4 space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center text-gray-600 dark:text-gray-300">上传中 {Math.round(uploadProgress)}%</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-500 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}
