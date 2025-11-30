import { TextEditor } from '@/components/editor/text-editor'
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import { ActionButtons } from '@/components/editor/action-buttons'
import { ResultsPanel } from '@/components/results/results-panel'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Editor */}
        <div className="space-y-4">
          <EditorToolbar />
          <TextEditor />
          <ActionButtons />
        </div>

        {/* Right column: Results */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ResultsPanel />
        </div>
      </div>
    </div>
  )
}
