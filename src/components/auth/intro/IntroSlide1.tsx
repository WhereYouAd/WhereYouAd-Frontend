import SymbolWhite from "@/assets/logo/symbol-white.svg?react";

export default function IntroSlide1({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out bg-gradient-to-b from-logo-1 to-logo-2 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-96 w-96 items-center justify-center">
          <SymbolWhite className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
