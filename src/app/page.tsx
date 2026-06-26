
"use client"

import generateAgentConfig from '@/functions/generateAgentConfig';
import generateInstructions from '@/functions/generateInstructions';
import processProject from '@/functions/processProject.action';
import { AVAILABLE_TOOLS, PROVIDERS } from '@/lib/const';
import { ModelOption, ToolOption } from '@/types';
import { useState, useTransition } from 'react';

export default function Page() {
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
  const [selectedTools, setSelectedTools] = useState<ToolOption[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<{ path: string; content: string }[] | null>(null);
  const [expandedFileIndex, setExpandedFileIndex] = useState<number | null>(null);
  const [base64Archive, setBase64Archive] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleTool = (tool: ToolOption) => {
    if (selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools(selectedTools.filter(t => t.id !== tool.id));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      alert("Por favor, selecione um modelo de inteligência artificial primeiro.");
      return;
    }

    const projectSlug = agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'eve-agent';

    const files = [
      { path: 'agent/instructions.md', content: generateInstructions(agentName, description) },
      { path: 'agent/agent.ts', content: generateAgentConfig(agentName, selectedModel) }
    ];

    selectedTools.forEach(tool => {
      files.push({
        path: `agent/tools/${tool.id}.ts`,
        content: tool.code
      });
    });

    setGeneratedFiles(files);
    setExpandedFileIndex(null);

    // Invoca as capacidades nativas do Bun no servidor
    startTransition(async () => {
      const result = await processProject(projectSlug, files);
      if (result.success && result.base64Zip) {
        setBase64Archive(result.base64Zip);
      } else {
        console.error("Falha ao processar no runtime do Bun:", result.error);
      }
    });
  };



  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Eve Wizard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Build Eve
          </p>
        </div>

        <form onSubmit={handleGenerate} className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 sm:p-8 space-y-8">
          {/* Metadados */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Agente</label>
              <input type="text" required placeholder="Ex: Bot de Monitorização" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none" value={agentName} onChange={e => setAgentName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Diretrizes e Regras (Instructions)</label>
              <textarea required rows={3} placeholder="Escreve o comportamento principal que o agente deve assume..." className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>

          {/* Provedores/Modelos */}
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

          {/* Lista de Ferramentas */}
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

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold p-3.5 rounded-xl shadow-sm transition-all text-center disabled:bg-gray-400"
          >
            {isPending ? 'Bun a estruturar e a compactar ambiente...' : 'Compilar e Gravar Código do Agente'}
          </button>
        </form>

        {/* Output do Workspace */}
        {generatedFiles && (
          <div className="mt-8 bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Workspace Gerado</h2>
                <p className="text-xs text-gray-500 mt-0.5">Ficheiros criados localmente. Expande para analisar o código.</p>
              </div>
              <button
                onClick={() => handleDownloadZip(base64Archive, agentName)}
                disabled={!base64Archive}
                className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all whitespace-nowrap disabled:bg-gray-300"
              >
                Descarregar Projeto (.ZIP)
              </button>
            </div>

            <div className="space-y-3">
              {generatedFiles.map((file, idx) => {
                const isExpanded = expandedFileIndex === idx;
                return (
                  <div key={file.path} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div
                      onClick={() => setExpandedFileIndex(isExpanded ? null : idx)}
                      className="flex items-center justify-between p-3.5 bg-gray-50 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-mono text-sm font-medium text-gray-700">📁 {file.path}</span>
                      <span className="text-xs text-blue-600 font-semibold">
                        {isExpanded ? 'Ocultar' : 'Ver código'}
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="p-4 bg-gray-900 border-t border-gray-200 overflow-x-auto">
                        <pre className="text-xs font-mono text-gray-100 leading-relaxed whitespace-pre-wrap">
                          {file.content}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}