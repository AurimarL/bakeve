import { AVAILABLE_CHANNELS } from "@/lib/const";
import { ChannelOption } from "@/types";

export default function ChannelsList({ selectedChannels, toggleChannel }: { selectedChannels: ChannelOption[]; toggleChannel: (channel: ChannelOption) => void }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Channels <span className="text-slate-500 font-normal">(optional)</span></label>
            <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_CHANNELS.map(channel => {
                    const isChecked = selectedChannels.some(t => t.id === channel.id);
                    return (
                        <label key={channel.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 select-none ${isChecked ? 'bg-green-500/10 text-white border-green-500' : 'bg-slate-700 text-slate-200 border-slate-600 hover:border-slate-500'}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleChannel(channel)} className="mt-1 size-4 rounded border-slate-500 text-green-500 focus:ring-green-500 bg-slate-700" />
                            <div className="ml-4">
                                <div className="text-sm font-bold flex items-center gap-2">
                                    {channel.name}
                                    <span className={`font-mono text-xs ${isChecked ? 'text-green-400' : 'text-slate-500'}`}>({channel.id})</span>
                                </div>
                                <div className={`text-xs mt-1 ${isChecked ? 'text-slate-300' : 'text-slate-400'}`}>{channel.description}</div>
                                {channel.sampleEnv && channel.sampleEnv.length > 0 && (
                                    <div className="text-xs mt-2 text-slate-500 font-mono">{channel.sampleEnv.join(', ')}</div>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    )
}
