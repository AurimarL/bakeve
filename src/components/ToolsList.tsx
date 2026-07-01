import { AVAILABLE_TOOLS } from "@/lib/const";
import { ToolOption } from "@/types";

export default function ToolsList({ selectedTools, toggleTool }: { selectedTools: ToolOption[]; toggleTool: (tool: ToolOption) => void }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Tools <span className="text-slate-500 font-normal">(optional)</span></label>
            <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_TOOLS.map(tool => {
                    const isChecked = selectedTools.some(t => t.id === tool.id);
                    return (
                        <label key={tool.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 select-none ${isChecked ? 'bg-green-500/10 text-white border-green-500' : 'bg-slate-700 text-slate-200 border-slate-600 hover:border-slate-500'}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleTool(tool)} className="mt-1 size-4 rounded border-slate-500 text-green-500 focus:ring-green-500 bg-slate-700" />
                            <div className="ml-4">
                                <div className="text-sm font-bold flex items-center gap-2">
                                    {tool.name}
                                    <span className={`font-mono text-xs ${isChecked ? 'text-green-400' : 'text-slate-500'}`}>({tool.id}.ts)</span>
                                </div>
                                <div className={`text-xs mt-1 ${isChecked ? 'text-slate-300' : 'text-slate-400'}`}>{tool.description}</div>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    )
}