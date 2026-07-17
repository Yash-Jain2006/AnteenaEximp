"use client";

import { useState, useEffect } from "react";
import type { QuoteRequestRow } from "@/lib/database.types";
import { updateInquiryStatus } from "../actions";

export default function QuotesClient({ initialData, initialId }: { initialData: QuoteRequestRow[], initialId: number | null }) {
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState<QuoteRequestRow | null>(
    initialId ? data.find(d => d.id === initialId) || null : null
  );

  useEffect(() => {
    if (selected && selected.status === "new") {
      updateInquiryStatus("quote_requests", selected.id, "reviewing").then((res) => {
        if (res.success) {
          setData(prev => prev.map(d => d.id === selected.id ? { ...d, status: "reviewing" } : d));
          setSelected({ ...selected, status: "reviewing" });
        }
      });
    }
  }, [selected]);

  const handleStatusChange = async (status: "new" | "reviewing" | "replied" | "closed") => {
    if (!selected) return;
    const res = await updateInquiryStatus("quote_requests", selected.id, status);
    if (res.success) {
      setData(prev => prev.map(d => d.id === selected.id ? { ...d, status } : d));
      setSelected({ ...selected, status });
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 overflow-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Client</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Product</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Qty</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No quote requests found.</td></tr>
            ) : data.map(item => (
              <tr key={item.id} className={`border-b hover:bg-gray-50 cursor-pointer ${selected?.id === item.id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(item)}>
                <td className="p-3 text-sm">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-sm">{item.name} {item.company ? <span className="text-gray-500">({item.company})</span> : ''}</td>
                <td className="p-3 text-sm">{item.product_name}</td>
                <td className="p-3 text-sm">{item.quantity} {item.unit}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    item.status === 'new' ? 'bg-red-100 text-red-800' : 
                    item.status === 'reviewing' ? 'bg-amber-100 text-amber-800' :
                    item.status === 'replied' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="w-[400px] bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col gap-4 sticky top-4 h-fit max-h-[85vh] overflow-auto">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold">Quote Details</h2>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-800 p-1">✕</button>
          </div>
          
          <div className="text-sm space-y-3">
            <div>
              <strong className="block text-gray-500">From</strong> 
              {selected.name} {selected.company ? `(${selected.company})` : ''}
            </div>
            <div>
              <strong className="block text-gray-500">Email</strong> 
              <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a>
            </div>
            <div>
              <strong className="block text-gray-500">Phone</strong> 
              {selected.phone} 
              {selected.phone && <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`} className="ml-3 text-green-600 hover:underline font-medium" target="_blank" rel="noreferrer">WhatsApp ↗</a>}
            </div>
            <div>
              <strong className="block text-gray-500">Country</strong> 
              {selected.country}
            </div>
            
            <div className="pt-2 border-t">
              <strong className="block text-gray-500">Product</strong> 
              {selected.product_name} <span className="text-xs text-gray-400">({selected.product_category})</span>
            </div>
            <div>
              <strong className="block text-gray-500">Grade / Type</strong> 
              {selected.grade || 'N/A'}
            </div>
            <div>
              <strong className="block text-gray-500">Quantity</strong> 
              {selected.quantity} {selected.unit}
            </div>
            <div>
              <strong className="block text-gray-500">Packaging</strong> 
              {selected.packaging || 'N/A'}
            </div>
            <div>
              <strong className="block text-gray-500">Destination Port</strong> 
              {selected.destination_port || 'N/A'}
            </div>
            <div>
              <strong className="block text-gray-500">Incoterm</strong> 
              {selected.incoterm || 'N/A'}
            </div>
            
            {selected.notes && (
              <div className="pt-2 border-t">
                <strong className="block text-gray-500">Additional Notes</strong>
                <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded mt-1 border border-gray-100 text-gray-800">
                  {selected.notes}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 border-t pt-4">
            <strong className="text-sm text-gray-500 block mb-2">Update Status</strong>
            <div className="flex flex-wrap gap-2">
              {['new', 'reviewing', 'replied', 'closed'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as "new" | "reviewing" | "replied" | "closed")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                    selected.status === status 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <a href={`mailto:${selected.email}`} className="w-full text-center py-2.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 mt-2 transition-colors">
            Reply via Email
          </a>
        </div>
      )}
    </div>
  );
}
