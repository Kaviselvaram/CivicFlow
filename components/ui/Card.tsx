import React from "react";

export function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E8E2D8] rounded-xl p-5 shadow-xs transition duration-200 ${
        hover
          ? "hover:border-[#D5CCC0] hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = "",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between pb-4 border-b border-[#E8E2D8] mb-4 ${className}`}>
      <div>
        <h3 className="font-display font-semibold text-lg text-[#182026] leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-[#788290] mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
