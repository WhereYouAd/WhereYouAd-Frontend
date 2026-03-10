import PlatformComparisonChart from "./PlatformComparisonChart";
import PlatformRoasTable from "./PlatformRoasTable";

export default function PlatformComparison() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 2xl:gap-x-16 gap-y-12 items-stretch">
      <div className="flex flex-col w-full min-w-0">
        <PlatformComparisonChart />
      </div>
      <div className="flex flex-col w-full min-w-0 xl:pl-4 xl:border-l xl:border-white/40">
        <PlatformRoasTable />
      </div>
    </div>
  );
}
