type TAlign = "left" | "center";

export default function LandingSectionHeader({
  title,
  subtitle,
  align = "center",
  className = "",
}: {
  title: string;
  subtitle?: string;
  align?: TAlign;
  className?: string;
}) {
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <div className={`${alignClass} ${className}`.trim()}>
      <h2 className="font-heading1 md:text-[40px] font-bold text-text-title leading-snug tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 font-body1 text-text-auth-sub leading-relaxed break-keep">
          {subtitle}
        </p>
      )}
    </div>
  );
}
