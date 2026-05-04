import AuthFormShell from "@/components/auth/common/AuthFormShell";
import { Skeleton } from "@/components/common/skeleton/Skeleton";

export default function SignupEmailStepSkeleton() {
  return (
    <AuthFormShell variant="step">
      <div className="mb-10 flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-56" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-14 w-full rounded-component-md" />
          </div>
          <Skeleton className="h-14 w-24 rounded-component-md" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-14 w-full rounded-component-md" />
        </div>

        <div className="mt-4">
          <Skeleton className="h-14 w-full rounded-component-md" />
        </div>
      </div>
    </AuthFormShell>
  );
}
