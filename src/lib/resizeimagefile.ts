interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0~1
}

// 이미지 파일을 캔버스로 리사이징/압축한 뒤 File로 반환
// 원본이 maxWidth/maxHeight보다 작으면 리사이징 없이 압축만 적용
export async function resizeImageFile(
  file: File,
  { maxWidth = 1200, maxHeight = 1200, quality = 0.85 }: ResizeOptions = {},
): Promise<File> {
  // gif는 애니메이션이 깨질 수 있어 리사이징하지 않고 원본 그대로 반환
  if (file.type === 'image/gif') return file;

  const imageUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(imageUrl);

    let { width, height } = img;
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    );
    if (!blob) return file;

    // 이미 작은 이미지였던 경우 원본을 그대로 사용
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
    img.src = src;
  });
}
