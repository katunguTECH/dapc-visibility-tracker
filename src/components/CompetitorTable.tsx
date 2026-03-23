import React from 'react';
import { Globe, Trophy, Users } from 'lucide-react';

export default function CompetitorTable({ competitors, currentBusiness }: { competitors: any[], currentBusiness: string }) {
  return (
    <div className="mt-10 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-6">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="text-amber-500" size={18} />
            Market Leaders: {competitors[0]?.title || "Competitors"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Who is currently dominating your local category.</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b">
          <tr>
            <th className="px-6 py-3">Rank</th>
            <th className="px-6 py-3">Business</th>
            <th className="px-6 py-3">Trust</th>
            <th className="px-6 py-3">Web</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {competitors.map((comp, idx) => (
            <tr key={idx} className={comp.title === currentBusiness ? "bg-blue-50/70" : "hover:bg-slate-50/50"}>
              <td className="px-6 py-4 font-black text-slate-300">#{comp.rank}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-slate-800">{comp.title}</div>
                {comp.title === currentBusiness && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">YOU</span>
                )}
              </td>
              <td className="px-6 py-4 flex items-center gap-1">
                <span className="text-amber-500 font-bold">{comp.rating}</span>
                <span className="text-slate-400 text-xs">({comp.reviews})</span>
              </td>
              <td className="px-6 py-4">
                {comp.hasWebsite ? (
                  <Globe size={16} className="text-green-500" />
                ) : (
                  <span className="text-slate-300 text-xs">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}