import PlatformComparisonChart from "./PlatformComparisonChart";
import PlatformRoasTable from "./PlatformRoasTable";

export default function PlatformComparison() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16">
      <div className="flex flex-col">
        <PlatformComparisonChart />
      </div>
      <div className="flex flex-col">
        <PlatformRoasTable />
      </div>
    </div>
  );
}
