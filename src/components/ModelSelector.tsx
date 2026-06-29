import { PROVIDERS } from "@/lib/const";
import { ModelOption } from "@/types";


export default function ModelSelector(
    { selectedModel, setSelectedModel }: { selectedModel: ModelOption | null; setSelectedModel: (model: ModelOption) => void }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Modelo de IA Nativo</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROVIDERS.map(provider => (
                    <div key={provider.name} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">{provider.name}</span>
                        <div className="mt-3 space-y-2.5">
                            {provider.models.map(model => (
                                <label key={model.id} className="flex items-center space-x-3 text-sm font-medium text-gray-700 cursor-pointer p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all">
                                    <input type="radio" name="model-group" checked={selectedModel?.id === model.id} onChange={() => setSelectedModel(model)} className="h-4 w-4 text-black focus:ring-black border-gray-300" />
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