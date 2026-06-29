"use server";
import { mkdir } from 'node:fs/promises';
export default async function processProject(projectSlug: string, files: { path: string; content: string }[]) {
    try {
        const baseTargetDir = `./generated-agents/${projectSlug}`;

        // garante que a pasta base exista (usa node:fs.promises em Bun)
        await mkdir(baseTargetDir, { recursive: true });

        // Mapa usado para criar o tar em memória
        const archiveFiles: Record<string, string> = {};

        for (const file of files) {
            // garante que subpastas existam antes de gravar
            const dir = file.path.includes('/') ? file.path.substring(0, file.path.lastIndexOf('/')) : '';
            if (dir) {
                await mkdir(`${baseTargetDir}/${dir}`, { recursive: true });
            }

            await Bun.write(`${baseTargetDir}/${file.path}`, file.content);

            // Alimenta o objeto para a criação do arquivo tar
            archiveFiles[file.path] = file.content;
        }

        // Criar o arquivo Tar nativo na memória usando Bun.Archive
        const archive = new Bun.Archive(archiveFiles, { compress: "gzip" });

        // Transformar o archive em um array de bytes (Uint8Array)
        const tarBytes = await archive.bytes();

        // Também grava o .tar.gz no disco para servir via endpoint, se desejado
        const tarPath = `${baseTargetDir}/${projectSlug}-scaffold.tar.gz`;
        await Bun.write(tarPath, tarBytes);

        // Converter para base64 para trafegar via JSON na Server Action com segurança
        const base64Tar = Buffer.from(tarBytes).toString('base64');

        return { success: true, base64Tar, tarPath };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}