export function formatStayDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}

export function formatSimDuration(meters: number) {
  const seconds = Math.max(1, Math.round(meters / 1.15));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes <= 0) return `${rest} giây`;
  if (rest === 0) return `${minutes} phút`;
  return `${minutes} phút ${rest} giây`;
}

export function formatMeters(meters: number) {
  return `${Math.round(meters)} m`;
}
