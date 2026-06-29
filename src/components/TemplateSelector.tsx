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
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                Modelo de Agente
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AGENT_TEMPLATES.map((template) => {
                    const isSelected = selectedId === template.id;
                    return (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => onSelect(template)}
                            className={`text-left p-4 rounded-xl border transition-all ${
                                isSelected
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-900 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                        >
                            <div className="text-sm font-bold">{template.name}</div>
                            <div className={`text-xs mt-1 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                                {template.description}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
