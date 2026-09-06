import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Database, Scale, Cpu, AlertCircle, ExternalLink } from "lucide-react";

interface ModelTransparencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModelTransparencyModal: React.FC<ModelTransparencyModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#FAF8F5] border-[#E5DFD5] p-6 shadow-2xl">
        <DialogHeader className="border-b border-[#E5DFD5] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#B81D24] text-white flex items-center justify-center font-bold text-sm">
              IS
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#0B132B]">
                MANAK AI System Architecture & Model Transparency
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-mono">
                Smart India Hackathon 2026 · Problem Statement SIH 26108
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Core Methodology */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#0B132B] text-sm">
              <Cpu className="w-4 h-4 text-[#B81D24]" />
              <span>1. Multi-Stage Recommendation Pipeline</span>
            </div>
            <p className="text-slate-600">
              MANAK AI combines structured technical entity extraction with semantic similarity retrieval over the official Bureau of Indian Standards (BIS) knowledge base. The decision-support pipeline operates in 4 verified stages:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-lg border border-[#E5DFD5]">
                <span className="font-mono font-bold text-[#B81D24] block">Stage 1: Entity & Parameter Parsing</span>
                <span className="text-[11px] text-slate-600">Extracts product classification, intended scope, operating environmental bounds, and numerical parameters (efficacy, pressure, yield stress).</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E5DFD5]">
                <span className="font-mono font-bold text-[#0B132B] block">Stage 2: Hybrid Semantic Vector Search</span>
                <span className="text-[11px] text-slate-600">Matches requirement embedding vectors against curated IS standard corpus with technical committee taxonomy cross-referencing.</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E5DFD5]">
                <span className="font-mono font-bold text-[#0B132B] block">Stage 3: Clause-Level Evidence Alignment</span>
                <span className="text-[11px] text-slate-600">Retrieves exact standard clauses, test methods, and tolerance thresholds to provide mathematical explainability for each recommendation.</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E5DFD5]">
                <span className="font-mono font-bold text-[#E67E22] block">Stage 4: MANAK Insight & Gap Audit</span>
                <span className="text-[11px] text-slate-600">Audits the tender specification against mandatory Quality Control Orders (QCO) and flags missing testing parameters before tender publication.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Knowledge Base Scope */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#0B132B] text-sm">
              <Database className="w-4 h-4 text-[#B81D24]" />
              <span>2. Curated Knowledge Base Coverage</span>
            </div>
            <p className="text-slate-600">
              The engine indexes standards across 14 BIS Division Councils, with high-density clause resolution in primary public procurement sectors:
            </p>
            <div className="p-3.5 bg-[#F3EFEA] rounded-lg border border-[#E5DFD5] space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div>• Electrotechnical (ETD)</div>
                <div>• Civil Engineering (CED)</div>
                <div>• Mechanical Engineering (MED)</div>
                <div>• Chemical Engineering (CHD)</div>
                <div>• Water Supply & Piping</div>
                <div>• Personal Protective Gear</div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-[#E5DFD5]">
                * Dataset scope disclaimer: This demonstration prototype operates over a curated, verified corpus of critical procurement standards. Full national deployment connects to the complete 22,000+ BIS active standards gazetted registry.
              </p>
            </div>
          </div>

          {/* Section 3: Legal & Regulatory Framework */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#0B132B] text-sm">
              <Scale className="w-4 h-4 text-[#B81D24]" />
              <span>3. General Financial Rules (GFR 2017) & GeM Alignment</span>
            </div>
            <p className="text-slate-600">
              Under <strong>Rule 144 of the General Financial Rules (GFR) 2017</strong>, public procurement tenders issued by Ministries, Departments, and Public Sector Undertakings (PSUs) must specify Indian Standards established by BIS. MANAK AI ensures full compliance with statutory <strong>Quality Control Orders (QCO)</strong> notified under the BIS Act, 2016.
            </p>
          </div>

          {/* Section 4: Human-in-the-Loop Principle */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Human-in-the-Loop Decision Support Mandate</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              MANAK AI is strictly designed as an intelligent decision-support instrument for procurement committees. It generates evidence-backed recommendations and flags specification ambiguities, but does not replace the human judgment of authorized procurement officers.
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-[#E5DFD5] pt-4">
          <div className="flex items-center justify-between w-full">
            <a
              href="https://www.bis.gov.in/?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#B81D24] hover:underline flex items-center gap-1 font-mono"
            >
              Visit Official BIS Portal (bis.gov.in)
              <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              size="sm"
              onClick={() => onOpenChange(false)}
              className="bg-[#0B132B] text-white text-xs"
              data-testid="transparency-modal-done-button"
            >
              Acknowledge & Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
