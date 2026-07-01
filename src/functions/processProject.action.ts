"use server";

export default async function processProject(
    projectSlug: string,
    files: { path: string; content: string }[]
) {
    try {
        const baseTargetDir = `./_temp_generated-agents/${projectSlug}`;
        const archiveFiles: Record<string, string> = {};

        // 1. Write files natively. Bun.write automatically handles missing subdirectories!
        for (const file of files) {
            const destinationPath = `${baseTargetDir}/${file.path}`;
            await Bun.write(destinationPath, file.content);

            // Populate the archive map
            archiveFiles[file.path] = file.content;
        }

        // 2. Create the native tar.gz archive in memory
        const archive = new Bun.Archive(archiveFiles, { compress: "gzip" });
        const tarBytes = await archive.bytes();

        // 3. Save the archive to disk
        const tarPath = `${baseTargetDir}/${projectSlug}-scaffold.tar.gz`;
        await Bun.write(tarPath, tarBytes);

        // 4. Native Bun Base64 conversion (much faster than Node's Buffer)
        const base64Tar = btoa(
            Array.from(tarBytes, byte => String.fromCharCode(byte)).join("")
        );

        return { success: true, base64Tar, tarPath, files };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}