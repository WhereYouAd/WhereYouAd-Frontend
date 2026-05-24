import { toast } from "sonner";

import PlatformIntegrationCard from "@/components/integration/PlatformIntegrationCard";

import { platformConnectionsMock } from "@/pages/integration/platformIntegrations.mock";

export default function PlatformIntegrationsPage() {
  return (
    <section className="flex w-full min-w-0 flex-col gap-6">
      <ul className="grid w-full min-w-0 list-none grid-cols-3 items-stretch gap-6 p-0 m-0 tablet:grid-cols-1">
        {platformConnectionsMock.map((item) => (
          <li
            key={item.provider}
            className="flex h-full min-h-0 w-full min-w-0"
          >
            <PlatformIntegrationCard
              {...item}
              onConnect={() => toast.message("연동하기 (mock)")}
              onReconnect={() => toast.message("재연동 (mock)")}
              onDisconnect={() => toast.message("연결 해제 (mock)")}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
