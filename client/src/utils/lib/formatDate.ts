export function formatDate(inputDate: string | undefined, format = 'relative') {
  if (!inputDate) return;
  const date = new Date(inputDate);
  const now = new Date();
  const diffMs = Number(now) - Number(date);

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (format === 'relative') {
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} h ago`;
    if (days < 7) return `${days} d ago`;
  }

  if (format === 'time') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
    });
  }

  if (format === 'full') {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('en-US');
}
