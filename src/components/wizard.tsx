"use client"

import generateProject from '@/functions/generateProject.action';
import { AGENT_TEMPLATES, AVAILABLE_TOOLS, PROVIDERS, AVAILABLE_CHANNELS, AVAILABLE_CONNECTIONS } from '@/lib/const';
import { AgentTemplate, ModelOption, ToolOption, ChannelOption, ConnectionOption } from '@/types';
import { useState, useTransition } from 'react';

import ModelSelector from './ModelSelector';
import TemplateSelector from './TemplateSelector';
import ToolsList from './ToolsList';
import OutputFilePreview from './OutputFilePreview';
import ChannelsList from './ChannelsList';
import ConnectionsList from './ConnectionsList';

export default function Wizard() {

    const [selectedTools, setSelectedTools] = useState<ToolOption[]>([]);
    const [agentName, setAgentName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
    const [generatedFiles, setGeneratedFiles] = useState<{ path: string; content: string }[] | null>(null);
    const [expandedFileIndex, setExpandedFileIndex] = useState<number | null>(null);
    const [base64Archive, setBase64Archive] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [selectedChannels, setSelectedChannels] = useState<ChannelOption[]>([]);
    const [selectedConnections, setSelectedConnections] = useState<ConnectionOption[]>([]);

    const handleSelectTemplate = (template: AgentTemplate) => {
        setSelectedTemplateId(template.id);
        setAgentName(template.agentName);
        setDescription(template.instructions);
        const allModels = PROVIDERS.flatMap(p => p.models);
        setSelectedModel(allModels.find(m => m.id === template.modelId) ?? null);
        setSelectedTools(AVAILABLE_TOOLS.filter(t => template.toolIds.includes(t.id)));
        setSelectedChannels(AVAILABLE_CHANNELS.filter(c => template.channelIds?.includes(c.id)));
        setSelectedConnections(AVAILABLE_CONNECTIONS.filter(c => template.connectionIds?.includes(c.id)));
    };

    const toggleTool = (tool: ToolOption) => {
        if (selectedTools.find(t => t.id === tool.id)) {
            setSelectedTools(selectedTools.filter(t => t.id !== tool.id));
        } else {
            setSelectedTools([...selectedTools, tool]);
        }
    };

    const toggleChannel = (channel: ChannelOption) => {
        if (selectedChannels.find(c => c.id === channel.id)) {
            setSelectedChannels(selectedChannels.filter(c => c.id !== channel.id));
        } else {
            setSelectedChannels([...selectedChannels, channel]);
        }
    };

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedModel) {
            alert("Por favor, selecione um modelo de inteligência artificial primeiro.");
            return;
        }

        const projectSlug = agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'eve-agent';

        // Server-side first: request server action to generate project and return archive
        setGeneratedFiles(null);
        setExpandedFileIndex(null);

        startTransition(async () => {
            const result = await generateProject(projectSlug, agentName, description, selectedModel, selectedTools, selectedChannels, selectedConnections);
            if (result.success && result.base64Tar) {
                setGeneratedFiles(result.files ?? []);
                setBase64Archive(result.base64Tar);
            } else {
                console.error("Falha ao processar no runtime do Bun:", result.error);
            }
        });
    };


    return (
        <div>
            <form onSubmit={handleGenerate} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8">

                {/* Templates */}

                <TemplateSelector selectedId={selectedTemplateId} onSelect={handleSelectTemplate} />

                {/* Metadados */}

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-1">Agent Name</label>
                        <input type="text" required placeholder="e.g. Slack Notifier" className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-600 p-2.5 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none" value={agentName} onChange={e => setAgentName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-1">Instructions</label>
                        <textarea required rows={3} placeholder="Describe the agent's role, behaviour and rules..." className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-600 p-2.5 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none resize-none" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>

                {/* Provedores/Modelos */}

                <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

                {/* Channels */}

                <ChannelsList selectedChannels={selectedChannels} toggleChannel={toggleChannel} />

                {/* Connections */}

                <ConnectionsList selectedConnections={selectedConnections} toggleConnection={(c) => {
                    if (selectedConnections.find(s => s.id === c.id)) {
                        setSelectedConnections(selectedConnections.filter(x => x.id !== c.id));
                    } else {
                        setSelectedConnections([...selectedConnections, c]);
                    }
                }} />

                {/* Lista de Ferramentas */}

                <ToolsList selectedTools={selectedTools} toggleTool={toggleTool} />

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-white hover:bg-neutral-100 text-black font-semibold p-3.5 rounded-xl transition-colors duration-200 text-center cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Scaffolding project...' : 'Generate Agent'}
                </button>
            </form>

            {/* Output do Workspace */}

            <OutputFilePreview
                agentName={agentName}
                generatedFiles={generatedFiles}
                expandedFileIndex={expandedFileIndex}
                setExpandedFileIndex={setExpandedFileIndex}
                base64Archive={base64Archive}
            />
        </div>
    )
}


