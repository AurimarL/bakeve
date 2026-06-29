import { AVAILABLE_CONNECTIONS } from "@/lib/const";
import { ConnectionOption } from "@/types";

export default function ConnectionsList({ selectedConnections, toggleConnection }: { selectedConnections: ConnectionOption[]; toggleConnection: (connection: ConnectionOption) => void }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Conexões Disponíveis (Opcional)</label>
            <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_CONNECTIONS.map(connection => {
                    const isChecked = selectedConnections.some(t => t.id === connection.id);
                    return (
                        <label key={connection.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all select-none ${isChecked ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleConnection(connection)} className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                            <div className="ml-4">
                                <div className="text-sm font-bold flex items-center gap-2">
                                    {connection.name}
                                    <span className={`font-mono text-xs ${isChecked ? 'text-gray-300' : 'text-gray-400'}`}>({connection.id})</span>
                                </div>
                                <div className={`text-xs mt-1 ${isChecked ? 'text-gray-200' : 'text-gray-500'}`}>{connection.description}</div>
                                {connection.sampleEnv && (
                                    <div className="text-xs mt-2 text-gray-400">Variáveis: {connection.sampleEnv.join(', ')}</div>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    )
}
