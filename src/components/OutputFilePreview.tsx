import handleDownloadZip from "@/functions/handleDownloadZip";

export default function OutputFilePreview({
    generatedFiles,
    expandedFileIndex,
    setExpandedFileIndex,
    base64Archive,
    agentName
}: {
    generatedFiles: { path: string; content: string }[] | null;
    expandedFileIndex: number | null;
    setExpandedFileIndex: React.Dispatch<React.SetStateAction<number | null>>;
    base64Archive: string | null;
    agentName: string;
}) {

    if (generatedFiles) {
        return (
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
                        Descarregar Projeto (.tar/.zip)
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
        )
    }
}