import SymbolWhite from "@/assets/logo/service-logo/symbol-white.svg?react";

export default function IntroLogo({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ease-out bg-linear-to-b from-logo-1 to-logo-2 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
      }`}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-8">
        <div className="flex h-80 w-80 items-center justify-center">
          <SymbolWhite className="h-full w-full drop-shadow-xl" />
        </div>
        <p className="font-heading1 text-white tracking-tight">Where you ad</p>
      </div>
    </div>
  );
}
