import { AGENT_TEMPLATES } from "@/lib/const";
import { AgentTemplate } from "@/types";

export default function TemplateSelector({
    selectedId,
    onSelect,
}: {
    selectedId: string | null;
    onSelect: (template: AgentTemplate) => void;
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
                Agent Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AGENT_TEMPLATES.map((template) => {
                    const isSelected = selectedId === template.id;
                    return (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => onSelect(template)}
                            className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                                isSelected
                                    ? "bg-green-500/10 text-white border-green-500"
                                    : "bg-slate-700 text-slate-200 border-slate-600 hover:border-slate-500 hover:bg-slate-700/80"
                            }`}
                        >
                            <div className="text-sm font-bold">{template.name}</div>
                            <div className={`text-xs mt-1 ${isSelected ? "text-green-300" : "text-slate-400"}`}>
                                {template.description}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
