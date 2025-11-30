import { TextEditor } from '@/components/editor/text-editor'
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import { ActionButtons } from '@/components/editor/action-buttons'
import { ResultsPanel } from '@/components/results/results-panel'

export default function EditorPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Toolbar */}
      <EditorToolbar />

      {/* Full-width Editor */}
      <TextEditor />

      {/* Action Buttons */}
      <ActionButtons />

      {/* Results Panel at the bottom */}
      <ResultsPanel />
    </div>
  )
}
