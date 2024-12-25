export const convertTime = (time) => {
  const now = new Date();
  const chapterTime = new Date(time);
  const difference = now - chapterTime;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} detik yang lalu`;
  } else if (minutes < 60) {
    return `${minutes} menit yang lalu`;
  } else if (hours < 24) {
    return `${hours} jam yang lalu`;
  } else {
    return `${days} hari yang lalu`;
  }
};
