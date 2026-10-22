export function SceneLoading({ label = "Đang dựng không gian" }: { label?: string }) {
  return (
    <div className="grid h-full min-h-64 place-items-center bg-ivory px-6 text-center text-ink">
      <div>
        <p className="font-display text-4xl leading-none">Rex Hotel Saigon</p>
        <p className="mt-3 text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
