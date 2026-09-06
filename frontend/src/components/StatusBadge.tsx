import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";

interface StatusBadgeProps {
  status: "current" | "under_revision" | "withdrawn" | string;
  reaffirmationYear?: number | null;
  qcoMandatory?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  reaffirmationYear,
  qcoMandatory,
  className = "",
}) => {
  const normalized = (status || "current").toLowerCase();

  let badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-300";
  let label = "Current";
  let icon = <CheckCircle2 className="w-3 h-3 text-emerald-600" />;

  if (normalized.includes("revision") || normalized === "under_revision") {
    badgeStyle = "bg-amber-50 text-amber-800 border-amber-300";
    label = "Under Revision";
    icon = <AlertTriangle className="w-3 h-3 text-amber-600" />;
  } else if (normalized.includes("withdraw") || normalized === "withdrawn" || normalized === "superseded") {
    badgeStyle = "bg-rose-50 text-rose-800 border-rose-300";
    label = "Withdrawn / Superseded";
    icon = <XCircle className="w-3 h-3 text-rose-600" />;
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} data-testid="is-status-badge-container">
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border font-mono tracking-tight ${badgeStyle}`}
        data-testid="is-status-pill"
      >
        {icon}
        <span>{label}</span>
        {reaffirmationYear && (
          <span className="text-[10px] opacity-75">({reaffirmationYear})</span>
        )}
      </span>

      {qcoMandatory && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0B132B] text-white border border-slate-700 font-mono"
          title="Covered under Mandatory Quality Control Order (QCO)"
          data-testid="qco-mandatory-badge"
        >
          <ShieldCheck className="w-3 h-3 text-amber-400" />
          <span>QCO MANDATORY</span>
        </span>
      )}
    </div>
  );
};
