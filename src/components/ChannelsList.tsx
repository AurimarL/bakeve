import { AVAILABLE_CHANNELS } from "@/lib/const";
import { ChannelOption } from "@/types";

export default function ChannelsList({ selectedChannels, toggleChannel }: { selectedChannels: ChannelOption[]; toggleChannel: (channel: ChannelOption) => void }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Canais Disponíveis (Opcional)</label>
            <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_CHANNELS.map(channel => {
                    const isChecked = selectedChannels.some(t => t.id === channel.id);
                    return (
                        <label key={channel.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all select-none ${isChecked ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleChannel(channel)} className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                            <div className="ml-4">
                                <div className="text-sm font-bold flex items-center gap-2">
                                    {channel.name}
                                    <span className={`font-mono text-xs ${isChecked ? 'text-gray-300' : 'text-gray-400'}`}>({channel.id})</span>
                                </div>
                                <div className={`text-xs mt-1 ${isChecked ? 'text-gray-200' : 'text-gray-500'}`}>{channel.description}</div>
                                {channel.sampleEnv && (
                                    <div className="text-xs mt-2 text-gray-400">Variáveis: {channel.sampleEnv.join(', ')}</div>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    )
}
