import React from 'react';
import { Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

export default function LeadsSection({ opportunities, businessName }: { opportunities: any[], businessName: string }) {
  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-amber-500" size={24} />
        <h2 className="text-2xl font-black text-slate-900">Growth Leads for {businessName}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {opportunities.map((op) => (
          <div key={op.id} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
                  {op.type}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{op.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{op.description}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 border-t pt-4 border-slate-50">
              <span className="text-xs font-bold text-slate-400">Potential Impact:</span>
              <span className={`text-xs font-bold ${op.impact === 'High' ? 'text-green-600' : 'text-blue-600'}`}>
                {op.impact} Growth
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}