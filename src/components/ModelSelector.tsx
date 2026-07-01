import { PROVIDERS } from "@/lib/const";
import { ModelOption } from "@/types";


export default function ModelSelector(
    { selectedModel, setSelectedModel }: { selectedModel: ModelOption | null; setSelectedModel: (model: ModelOption) => void }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">AI Model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROVIDERS.map(provider => (
                    <div key={provider.name} className="border border-slate-600 rounded-lg p-4 bg-slate-700/50">
                        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{provider.name}</span>
                        <div className="mt-3 space-y-2.5">
                            {provider.models.map(model => (
                                <label key={model.id} className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer p-1.5 hover:bg-slate-600 rounded border border-transparent hover:border-slate-500 transition-all duration-150">
                                    <input type="radio" name="model-group" checked={selectedModel?.id === model.id} onChange={() => setSelectedModel(model)} className="size-4 text-green-500 focus:ring-green-500 border-slate-500 bg-slate-700" />
                                    <span>{model.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}