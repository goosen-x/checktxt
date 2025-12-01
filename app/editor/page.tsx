import { TextEditor } from '@/components/editor/text-editor'
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import { ActionButtons } from '@/components/editor/action-buttons'
import { ResultsPanel } from '@/components/results/results-panel'

export default function EditorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <EditorToolbar />
      <TextEditor />
      <ActionButtons />
      <ResultsPanel />
    </div>
  )
}
