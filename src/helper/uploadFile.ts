import fs from 'node:fs'
import path from 'node:path'

async function uploadFile(file: File, pathFile: string, addName: string): Promise<any> {

    let savedFilename: string | null = null;
    let savedRelativePath: string | null = null;
    let detectedFileSize: number | null = null;

    if (file && typeof file.arrayBuffer === 'function') {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', pathFile)
        await fs.promises.mkdir(uploadsDir, { recursive: true })

        const originalName = path.basename(file.name || 'uploaded')
        const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
        const filename = `${Date.now()}-${addName}-${safeName}`
        const filePath = path.join(uploadsDir, filename)

        const buffer = Buffer.from(await file.arrayBuffer())
        await fs.promises.writeFile(filePath, buffer)

        savedFilename = filename
        savedRelativePath = `/uploads/${pathFile}/${filename}`
        detectedFileSize = buffer.length
    }

    return savedRelativePath
}

export default uploadFile;