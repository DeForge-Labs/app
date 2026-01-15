import {
  File,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
} from "lucide-react";

const getFileIcon = (fileType, fileName) => {
  const extension = fileName?.split(".").pop()?.toLowerCase();

  // Image files
  if (
    fileType?.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)
  ) {
    return FileImage;
  }

  // Video files
  if (
    fileType?.startsWith("video/") ||
    ["mp4", "avi", "mov", "wmv", "flv", "mkv"].includes(extension)
  ) {
    return FileVideo;
  }

  // Audio files
  if (
    fileType?.startsWith("audio/") ||
    ["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)
  ) {
    return FileAudio;
  }

  // Code files
  if (
    [
      "js",
      "jsx",
      "ts",
      "tsx",
      "py",
      "java",
      "cpp",
      "c",
      "cs",
      "php",
      "rb",
      "go",
      "rs",
      "swift",
      "html",
      "css",
      "json",
    ].includes(extension)
  ) {
    return FileCode;
  }

  // Archive files
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
    return FileArchive;
  }

  // Spreadsheet files
  if (
    ["xlsx", "xls", "csv"].includes(extension) ||
    fileType?.includes("spreadsheet")
  ) {
    return FileSpreadsheet;
  }

  // Document files
  if (
    ["pdf", "doc", "docx", "txt", "md", "rtf"].includes(extension) ||
    fileType?.includes("document")
  ) {
    return FileText;
  }

  // Default
  return File;
};

export default function FileIconDisplay({ fileName, fileType }) {
  const IconComponent = getFileIcon(fileType, fileName);

  return (
    <div className="shrink-0 w-10 h-10 rounded border border-foreground/15 bg-background flex items-center justify-center overflow-hidden">
      <IconComponent className="w-5 h-5 opacity-70" />
    </div>
  );
}
