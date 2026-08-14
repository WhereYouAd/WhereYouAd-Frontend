import { Skeleton } from "../common/skeleton/Skeleton";

export default function NotificationListSkeleton() {
  return (
    <ul className="flex flex-col gap-3 px-4 py-3" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index} className="flex flex-col gap-2 rounded-2xl px-3 py-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </li>
      ))}
    </ul>
  );
}
