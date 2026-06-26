const handleDownloadZip = (base64Archive: string | null, agentName: string) => {
    if (!base64Archive) return;

    // Descarrega o binário processado pelo Bun de forma 100% nativa no browser
    const projectSlug = agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'eve-agent';
    const binaryString = window.atob(base64Archive);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectSlug}-scaffold.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};