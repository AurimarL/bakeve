'use server';

export default async function processProject(projectSlug: string, files: { path: string; content: string }[]) {
    try {
        const baseTargetDir = `./generated-agents/${projectSlug}`;

        // 1. Gravar todos os ficheiros recorrendo ao Bun.write nativo
        for (const file of files) {
            await Bun.write(`${baseTargetDir}/${file.path}`, file.content);
        }

        // 2. Criar arquivo comprimido .zip nativo do sistema via Bun.spawn
        const zipProcess = Bun.spawn(["zip", "-r", `../../${projectSlug}-scaffold.zip`, "."], {
            cwd: baseTargetDir
        });
        await zipProcess.exited;

        // 3. Ler o arquivo zip gerado como um array de bytes para enviar de volta à UI de forma limpa
        const zipFile = Bun.file(`./generated-agents/${projectSlug}-scaffold.zip`);
        const arrayBuffer = await zipFile.arrayBuffer();

        // Converter para base64 para poder trafegar via JSON na Server Action com segurança
        const base64Zip = Buffer.from(arrayBuffer).toString('base64');

        return { success: true, base64Zip };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}