import { TextEditor } from '@/components/editor/text-editor'
import { EditorControls } from '@/components/editor/editor-controls'
import { ResultsPanel } from '@/components/results/results-panel'

export default function EditorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <EditorControls />
      <TextEditor />
      <ResultsPanel />
    </div>
  )
}
