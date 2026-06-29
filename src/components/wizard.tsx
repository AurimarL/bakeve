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
                // reconstruct generatedFiles client-side for preview
                const files = [
                    { path: 'agent/instructions.md', content: `...instructions available in archive...` },
                    { path: 'agent/agent.ts', content: `...agent config available in archive...` }
                ];

                selectedTools.forEach(tool => files.push({ path: `agent/tools/${tool.id}.ts`, content: `...tool file in archive...` }));

                // include channel placeholders in preview
                selectedChannels.forEach(channel => {
                    if (channel.id === 'slack') {
                        files.push({ path: 'agent/channels/slack.ts', content: `import { connectSlackCredentials } from "@vercel/connect/eve";\nimport { slackChannel } from "eve/channels/slack";\nexport default slackChannel({\n  credentials: connectSlackCredentials("slack/${projectSlug}"),\n});` });
                    }

                    if (channel.id === 'telegram') {
                        files.push({ path: 'agent/channels/telegram.ts', content: `import { telegramChannel } from "eve/channels/telegram";\nexport default telegramChannel({\n  botUsername: "${projectSlug}_bot",\n});` });
                    }
                });

                // include connection placeholders in preview
                selectedConnections.forEach(connection => {
                    if (connection.id === 'mcp-local') {
                        files.push({ path: 'agent/connections/mcp-local.ts', content: `import { defineMcpClientConnection } from "eve/connections";\nexport default defineMcpClientConnection({\n  url: "http://localhost:3001/mcp",\n  description: "Local dev server.",\n});` });
                    }

                    if (connection.id === 'mcp-linear') {
                        files.push({ path: 'agent/connections/mcp-linear.ts', content: `import { connect } from "@vercel/connect/eve";\nimport { defineMcpClientConnection } from "eve/connections";\nexport default defineMcpClientConnection({\n  url: "https://mcp.linear.app/mcp",\n  description: "Linear workspace: issues, projects, cycles, and comments.",\n  auth: connect("linear/${projectSlug}"),\n});` });
                    }
                });

                setGeneratedFiles(files);
                setBase64Archive(result.base64Tar);
            } else {
                console.error("Falha ao processar no runtime do Bun:", result.error);
            }
        });
    };


    return (
        <div>
            <form onSubmit={handleGenerate} className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 sm:p-8 space-y-8">

                {/* Templates */}

                <TemplateSelector selectedId={selectedTemplateId} onSelect={handleSelectTemplate} />

                {/* Metadados */}

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Agente</label>
                        <input type="text" required placeholder="Ex: Bot de Monitorização" className="  w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none" value={agentName} onChange={e => setAgentName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Diretrizes e Regras (Instructions)</label>
                        <textarea required rows={3} placeholder="Escreve o comportamento principal que o agente deve assume..." className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none" value={description} onChange={e => setDescription(e.target.value)} />
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
                    className="w-full bg-black hover:bg-gray-900 text-white font-semibold p-3.5 rounded-xl shadow-sm transition-all text-center disabled:bg-gray-400"
                >
                    {isPending ? 'Bun a estruturar e a compactar ambiente...' : 'Compilar e Gravar Código do Agente'}
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


