"use client";
import { Phone, MessageSquare, Copy, Globe, MapPin } from "lucide-react";

export default function LeadsSection({ leads }: { leads: any[] }) {
  if (!leads.length) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Number copied!");
  };

  return (
    <div className="mt-12 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        🚀 Identified Sales Opportunities
      </h3>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Business</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Contact Details</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Connect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{lead.title}</div>
                  <div className="text-xs text-slate-500 flex items-center mt-1">
                    <MapPin size={12} className="mr-1" /> {lead.address?.substring(0, 30)}...
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-800">{lead.phoneNumber || "No Phone"}</div>
                  {lead.website && (
                    <a href={lead.website} target="_blank" className="text-xs text-blue-600 flex items-center mt-1 hover:underline">
                      <Globe size={12} className="mr-1" /> Website
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => copyToClipboard(lead.phoneNumber)}
                      className="p-2 hover:bg-slate-100 rounded-md text-slate-600"
                    >
                      <Copy size={18} />
                    </button>
                    {lead.phoneNumber && (
                      <a 
                        href={`https://wa.me/${lead.phoneNumber.replace(/\D/g, '')}`}
                        target="_blank"
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-md"
                      >
                        <MessageSquare size={18} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}