export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num: number) => (num < 10 ? `0${num}` : num.toString());

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};
