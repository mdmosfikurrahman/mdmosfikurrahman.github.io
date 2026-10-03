import { useEffect, useState } from "react";

const format = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", hour12: false }).format(
    new Date(),
  );

// The time in Dhaka, refreshed every half minute: the reader's cue for when a
// reply is likely.
export function useDhakaTime(): string {
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}
