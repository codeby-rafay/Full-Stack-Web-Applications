export function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function randomEmoji(arr, id) {
  return arr[
    Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % arr.length
  ];
}
