import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Copy, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { ProcurementAnalysis } from "@/types/standards";

interface ExportBriefModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: ProcurementAnalysis | null;
}

export const ExportBriefModal: React.FC<ExportBriefModalProps> = ({
  open,
  onOpenChange,
  analysis,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!analysis) return null;

  const handleCopyClauses = () => {
    const textToCopy = `================================================================================
GOVERNMENT PUBLIC PROCUREMENT TENDER SPECIFICATION APPENDIX (INDIAN STANDARDS)
Prepared via MANAK AI — Recommendation Engine for Applicable IS Standards (SIH 26108)
Project / Item: ${analysis.title}
Sector / BIS Technical Department: ${analysis.sector} | ${analysis.department}
================================================================================

1. APPLICABLE INDIAN STANDARDS (MANDATORY TECHNICAL BENCHMARKS)
${analysis.recommendations
  .map(
    (rec, i) =>
      `[${i + 1}] ${rec.standard_code} : ${rec.standard_title}
     Status: ${rec.status.toUpperCase()} | QCO Mandatory: ${rec.qco_mandatory ? "YES" : "NO"}
     Why Recommended: ${rec.why_recommended}
     Key Clauses Required:
${rec.evidence_clauses.map((c) => `       - ${c.clause_no} (${c.clause_name}): ${c.evidence_text}`).join("\n")}`
  )
  .join("\n\n")}

2. SPECIFICATION GAP MITIGATION & MANDATORY CLAUSES FOR NOTICE INVITING TENDER (NIT):
${analysis.gap_analysis.recommended_spec_amendment}

3. QUALITY CONTROL ORDERS (QCO) & GFR RULE 144 MANDATE:
All bidders must furnish valid BIS Certification License (ISI Mark / CRS Registration) and test reports from NABL/BIS-accredited testing laboratories.
================================================================================`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Tender specification clauses copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FAF8F5] border-[#E5DFD5] p-0 shadow-2xl">
        {/* Printable Official Document Wrapper */}
        <div className="p-6 sm:p-10 space-y-8 bg-white relative guilloche-watermark">
          {/* Document Official Header */}
          <div className="border-b-2 border-[#0B132B] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-[#B81D24] text-white flex items-center justify-center font-black text-xl shadow-sm">
                मानक
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0B132B] tracking-tight">
                  TENDER SPECIFICATION APPENDIX: INDIAN STANDARDS CONFORMITY
                </h2>
                <p className="text-xs text-slate-600 font-mono">
                  MANAK AI · AI-Powered Recommendation Engine for Procurement (SIH 26108)
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-500">
              <div>Ref: MANAK-IS-{analysis.id.slice(0, 8).toUpperCase()}</div>
              <div>Date: {new Date(analysis.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
            </div>
          </div>

          {/* Legal Compliance Banner */}
          <div className="bg-[#F3EFEA] border border-[#E5DFD5] p-4 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[#0B132B]">
              <ShieldCheck className="w-4 h-4 text-[#B81D24]" />
              <span>General Financial Rules (GFR) 2017 — Rule 144 Statutory Notice</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              In accordance with GFR 2017 Rule 144(i)(b), technical specifications must be based on national standards certified by the Bureau of Indian Standards (BIS) wherever available. The standards below constitute the verified technical baseline for this procurement.
            </p>
          </div>

          {/* Procurement Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF8F5] rounded-lg border border-[#E5DFD5] text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase">Procurement Title</span>
              <span className="font-semibold text-[#0B132B]">{analysis.title}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase">BIS Technical Department</span>
              <span className="font-semibold text-[#0B132B]">{analysis.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase">Conformity Assessment Scheme</span>
              <span className="font-semibold text-[#0B132B]">{analysis.conformity_scheme || "As applicable"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase">Compliance Readiness</span>
              <span className="font-semibold text-emerald-800">{analysis.gap_analysis.readiness_score}/100 Score</span>
            </div>
          </div>

          {/* Section 1: Applicable IS Standards Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0B132B] uppercase tracking-wider font-mono border-b border-[#E5DFD5] pb-1">
              1. Applicable Indian Standards (IS Code & Scope)
            </h3>
            <div className="border border-[#E5DFD5] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B132B] text-white text-[11px] font-mono">
                  <tr>
                    <th className="p-2.5">IS Standard Code</th>
                    <th className="p-2.5">Standard Title</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Relevance</th>
                    <th className="p-2.5">QCO Mandatory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD5]">
                  {analysis.recommendations.map((rec, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-mono font-bold text-[#B81D24]">{rec.standard_code}</td>
                      <td className="p-2.5 font-medium text-slate-800">{rec.standard_title}</td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {rec.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono font-semibold">{rec.relevance_score}%</td>
                      <td className="p-2.5 font-mono text-[11px]">
                        {rec.qco_mandatory ? (
                          <span className="text-amber-700 font-bold">YES (Mandatory)</span>
                        ) : (
                          <span className="text-slate-500">Standard</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Key Clauses & Evidence Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0B132B] uppercase tracking-wider font-mono border-b border-[#E5DFD5] pb-1">
              2. Essential Clause References & Technical Benchmarks
            </h3>
            <div className="space-y-3 text-xs">
              {analysis.recommendations.map((rec, i) => (
                <div key={i} className="p-3 bg-[#FAF8F5] rounded border border-[#E5DFD5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#0B132B]">{rec.standard_code}</span>
                    <span className="text-[11px] text-slate-500">{rec.why_recommended}</span>
                  </div>
                  <div className="space-y-1.5 pl-2 border-l-2 border-[#B81D24]">
                    {rec.evidence_clauses.map((c, idx) => (
                      <div key={idx} className="text-[11px]">
                        <span className="font-mono font-semibold text-slate-800">{c.clause_no} ({c.clause_name}): </span>
                        <span className="text-slate-600">{c.evidence_text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recommended Tender Clause Amendment Text */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0B132B] uppercase tracking-wider font-mono border-b border-[#E5DFD5] pb-1">
              3. Recommended NIT Tender Specification Clauses
            </h3>
            <pre className="p-4 bg-[#0B132B] text-slate-200 text-xs font-mono rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
              {analysis.gap_analysis.recommended_spec_amendment}
            </pre>
          </div>

          {/* Official Sign-off Footer */}
          <div className="pt-6 border-t border-[#E5DFD5] grid grid-cols-2 gap-8 text-[11px] text-slate-500 font-mono">
            <div>
              <p className="font-semibold text-[#0B132B]">Prepared By:</p>
              <p>MANAK AI Decision Support System</p>
              <p>Problem SIH 26108 · Smart India Hackathon 2026</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#0B132B]">Verified & Approved By:</p>
              <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
              <p className="mt-1">Authorized Procurement Officer Signature</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <DialogFooter className="p-4 bg-[#FAF8F5] border-t border-[#E5DFD5] flex items-center justify-between sm:justify-between w-full no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs border-[#E5DFD5]"
            data-testid="export-modal-close-button"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyClauses}
              className="text-xs border-[#E5DFD5] flex items-center gap-1.5"
              data-testid="export-modal-copy-clauses-button"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy All Clauses"}</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-[#B81D24] hover:bg-[#991319] text-white text-xs flex items-center gap-1.5 shadow-sm"
              data-testid="export-modal-print-button"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
