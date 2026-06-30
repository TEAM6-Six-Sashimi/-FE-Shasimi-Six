export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(Math.floor(video.duration));
    };

    video.onerror = () => reject(new Error('영상 길이를 읽을 수 없습니다.'));

    video.src = URL.createObjectURL(file);
  });
}
