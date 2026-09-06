import React from "react";

interface RelevanceGaugeProps {
  score: number; // 0 to 100
  size?: "sm" | "md" | "lg";
}

export const RelevanceGauge: React.FC<RelevanceGaugeProps> = ({ score, size = "md" }) => {
  // Analytical, institutional score styling without tacky neon gradients
  const getColors = (val: number) => {
    if (val >= 90) return { text: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-600" };
    if (val >= 75) return { text: "text-[#0B132B]", bg: "bg-slate-100", border: "border-slate-300", bar: "bg-[#0B132B]" };
    return { text: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-600" };
  };

  const colors = getColors(score);

  if (size === "sm") {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-mono font-semibold ${colors.bg} ${colors.text} ${colors.border}`}
        data-testid="relevance-score-badge"
      >
        <span>{score}%</span>
        <span className="text-[10px] uppercase text-slate-500 font-sans">Match</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1" data-testid="relevance-score-gauge">
      <div className="flex items-baseline gap-1">
        <span className={`font-mono text-lg font-bold tracking-tight ${colors.text}`}>
          {score}%
        </span>
        <span className="text-[11px] font-medium text-slate-500 uppercase font-sans">
          Relevance
        </span>
      </div>
      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
