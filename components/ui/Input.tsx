import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  prefixIcon,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold text-[#182026] uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {prefixIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#788290]">
            {prefixIcon}
          </div>
        )}
        <input
          id={generatedId}
          className={`block w-full rounded-lg bg-white border border-[#D5CCC0] text-[#182026] placeholder-[#788290] text-sm py-2.5 px-3.5 transition duration-150 focus:border-[#19382F] focus:ring-1 focus:ring-[#19382F] focus:outline-none disabled:bg-[#F4EFEA] disabled:text-[#788290] ${
            prefixIcon ? "pl-10" : ""
          } ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : ""} ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#788290]">{helperText}</p>
      ) : null}
    </div>
  );
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = "",
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold text-[#182026] uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={generatedId}
        rows={rows}
        className={`block w-full rounded-lg bg-white border border-[#D5CCC0] text-[#182026] placeholder-[#788290] text-sm py-2.5 px-3.5 transition duration-150 focus:border-[#19382F] focus:ring-1 focus:ring-[#19382F] focus:outline-none disabled:bg-[#F4EFEA] disabled:text-[#788290] ${
          error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : ""
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#788290]">{helperText}</p>
      ) : null}
    </div>
  );
}
