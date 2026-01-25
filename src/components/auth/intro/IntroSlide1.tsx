import SymbolWhite from "@/assets/logo/symbol-white.svg?react";

export default function IntroSlide1({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out bg-linear-to-b from-logo-1 to-logo-2 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      <div className="flex h-full w-full items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 bg-white/15 blur-[90px] rounded-full pointer-events-none" />

        <div className="flex h-96 w-96 items-center justify-center relative z-10 transform hover:scale-105 transition-transform duration-700 ease-out">
          <SymbolWhite className="h-full w-full drop-shadow-xl" />
        </div>
      </div>
    </div>
  );
}
