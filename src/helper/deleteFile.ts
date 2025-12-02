import fs from 'node:fs'
import path from 'node:path'

async function deleteFile(filePath: string) {

    try {
        const urlPath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''));

        await fs.promises.unlink(urlPath).catch(() => { });

    } catch (e) {
        // ignore unlink errors
    }

}

export default deleteFile