import { AVAILABLE_TOOLS } from "@/lib/const";
import { ToolOption } from "@/types";

export default function ToolsList({ selectedTools, toggleTool }: { selectedTools: ToolOption[]; toggleTool: (tool: ToolOption) => void }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Ferramentas Disponíveis (Opcional)</label>
            <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_TOOLS.map(tool => {
                    const isChecked = selectedTools.some(t => t.id === tool.id);
                    return (
                        <label key={tool.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all select-none ${isChecked ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleTool(tool)} className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                            <div className="ml-4">
                                <div className="text-sm font-bold flex items-center gap-2">
                                    {tool.name}
                                    <span className={`font-mono text-xs ${isChecked ? 'text-gray-300' : 'text-gray-400'}`}>({tool.id}.ts)</span>
                                </div>
                                <div className={`text-xs mt-1 ${isChecked ? 'text-gray-200' : 'text-gray-500'}`}>{tool.description}</div>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    )
}