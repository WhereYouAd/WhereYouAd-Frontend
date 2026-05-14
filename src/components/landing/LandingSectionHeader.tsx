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
      <h2 className="font-heading1 text-text-title">{title}</h2>
      {subtitle && (
        <p className="mt-3 break-keep font-body1 text-text-auth-sub">
          {subtitle}
        </p>
      )}
    </div>
  );
}
