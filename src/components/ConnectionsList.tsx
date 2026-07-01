import { AVAILABLE_CONNECTIONS } from "@/lib/const";
import { ConnectionOption } from "@/types";

export default function ConnectionsList({ selectedConnections, toggleConnection }: { selectedConnections: ConnectionOption[]; toggleConnection: (connection: ConnectionOption) => void }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Connections <span className="text-slate-500 font-normal">(optional)</span></label>
            <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_CONNECTIONS.map(connection => {
                    const isChecked = selectedConnections.some(t => t.id === connection.id);
                    return (
                        <label key={connection.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 select-none ${isChecked ? 'bg-green-500/10 text-white border-green-500' : 'bg-slate-700 text-slate-200 border-slate-600 hover:border-slate-500'}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleConnection(connection)} className="mt-1 size-4 rounded border-slate-500 text-green-500 focus:ring-green-500 bg-slate-700" />
                            <div className="ml-4">
                                <div className="text-sm font-bold flex items-center gap-2">
                                    {connection.name}
                                    <span className={`font-mono text-xs ${isChecked ? 'text-green-400' : 'text-slate-500'}`}>({connection.id})</span>
                                </div>
                                <div className={`text-xs mt-1 ${isChecked ? 'text-slate-300' : 'text-slate-400'}`}>{connection.description}</div>
                                {connection.sampleEnv && connection.sampleEnv.length > 0 && (
                                    <div className="text-xs mt-2 text-slate-500 font-mono">{connection.sampleEnv.join(', ')}</div>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    )
}
