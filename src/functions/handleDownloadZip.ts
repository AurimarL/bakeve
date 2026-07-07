export default function handleDownloadZip(base64Archive: string | null, agentName: string) {
    if (!base64Archive) return;

    const projectSlug = agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'eve-agent';
    const binaryString = window.atob(base64Archive);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // 1. Alterado para o MIME type correto do Gzip/Tar
    const blob = new Blob([bytes], { type: 'application/gzip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // 2. Set the correct file extension to .tar.gz
    link.download = `${projectSlug}-scaffold.tar.gz`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};