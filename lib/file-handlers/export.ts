import { Document, Packer, Paragraph, TextRun } from 'docx'

/**
 * Export text to Markdown file.
 */
export function exportToMarkdown(text: string, filename: string = 'document.md'): void {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, filename)
}

/**
 * Export text to DOCX file.
 */
export async function exportToDocx(text: string, filename: string = 'document.docx'): Promise<void> {
  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim())

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.map(
          (para) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: para.trim(),
                  size: 24, // 12pt
                }),
              ],
              spacing: {
                after: 200, // Space after paragraph
              },
            })
        ),
      },
    ],
  })

  // Generate blob
  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, filename)
}

/**
 * Download a blob as a file.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export text to plain text file.
 */
export function exportToText(text: string, filename: string = 'document.txt'): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  downloadBlob(blob, filename)
}
