import PlatformComparisonChart from "./PlatformComparisonChart";
import PlatformRoasTable from "./PlatformRoasTable";

export default function PlatformComparison() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-bg-surface">
      <div className="pb-6 lg:pb-0 lg:pr-6">
        <PlatformComparisonChart />
      </div>
      <div className="pt-6 lg:pt-0 lg:pl-6">
        <PlatformRoasTable />
      </div>
    </div>
  );
}
