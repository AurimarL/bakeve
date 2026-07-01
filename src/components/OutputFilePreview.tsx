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
            <div className="mt-8 bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">Generated Workspace</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Files written locally. Expand to inspect the code.</p>
                    </div>
                    <button
                        onClick={() => handleDownloadZip(base64Archive, agentName)}
                        disabled={!base64Archive}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-slate-950 text-sm font-semibold rounded-xl transition-colors duration-200 whitespace-nowrap cursor-pointer disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        Download .tar.gz
                    </button>
                </div>

                <div className="flex flex-col gap-2.5">
                    {generatedFiles.map((file, idx) => {
                        const isExpanded = expandedFileIndex === idx;
                        return (
                            <div key={file.path} className="border border-slate-700 rounded-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setExpandedFileIndex(isExpanded ? null : idx)}
                                    className="w-full flex items-center justify-between p-3.5 bg-slate-700/60 cursor-pointer select-none hover:bg-slate-700 transition-colors duration-150 text-left"
                                >
                                    <span className="font-mono text-sm font-medium text-slate-300">{file.path}</span>
                                    <span className="text-xs text-green-400 font-semibold shrink-0 ml-4">
                                        {isExpanded ? 'Hide' : 'View'}
                                    </span>
                                </button>
                                {isExpanded && (
                                    <div className="p-4 bg-slate-950 border-t border-slate-700 overflow-x-auto">
                                        <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
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