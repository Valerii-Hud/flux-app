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

export const formatPostDate = (createdAt: string) => {
  const currentDate: number = Number(new Date());
  const createdAtDate: number = Number(new Date(createdAt));

  const timeDifferenceInSeconds = Math.floor(
    (currentDate - createdAtDate) / 1000
  );
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

  if (timeDifferenceInDays > 1) {
    return new Date(createdAtDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } else if (timeDifferenceInDays === 1) {
    return '1d';
  } else if (timeDifferenceInHours >= 1) {
    return `${timeDifferenceInHours}h`;
  } else if (timeDifferenceInMinutes >= 1) {
    return `${timeDifferenceInMinutes}m`;
  } else {
    return 'Just now';
  }
};

export const formatMemberSinceDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `Joined ${month} ${year}`;
};
