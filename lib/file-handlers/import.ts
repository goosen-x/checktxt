import mammoth from 'mammoth'

/**
 * Import text from a file.
 * Supports .txt, .md, and .docx files.
 */
export async function importFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'txt':
    case 'md':
      return importTextFile(file)
    case 'docx':
      return importDocxFile(file)
    default:
      throw new Error(`Unsupported file type: ${extension}`)
  }
}

/**
 * Import plain text or markdown file.
 */
async function importTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === 'string') {
        resolve(text)
      } else {
        reject(new Error('Failed to read file as text'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Import DOCX file using mammoth.
 */
async function importDocxFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

/**
 * Get file extension from filename.
 */
export function getFileExtension(filename: string): string | undefined {
  return filename.split('.').pop()?.toLowerCase()
}

/**
 * Check if file type is supported.
 */
export function isSupportedFileType(filename: string): boolean {
  const extension = getFileExtension(filename)
  return ['txt', 'md', 'docx'].includes(extension || '')
}
