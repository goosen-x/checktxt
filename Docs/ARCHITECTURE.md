# TextCheck - Архитектура приложения

## 1. Структура проекта

```
textcheck/
├── app/
│   ├── layout.tsx           # Корневой layout
│   ├── page.tsx             # Главная страница-редактор
│   ├── policy/
│   │   └── page.tsx         # Страница политики
│   ├── globals.css          # Глобальные стили + темы
│   └── api/
│       ├── lt/
│       │   └── route.ts     # Прокси к LanguageTool
│       ├── plag/
│       │   └── route.ts     # Проверка плагиата
│       └── analyze/
│           └── route.ts     # Локальные анализаторы
│
├── components/
│   ├── ui/                  # shadcn/ui компоненты
│   ├── editor/
│   │   ├── text-editor.tsx      # Основной редактор
│   │   ├── editor-toolbar.tsx   # Панель инструментов
│   │   ├── word-counter.tsx     # Счётчик слов
│   │   └── highlight-layer.tsx  # Слой подсветки
│   ├── results/
│   │   ├── results-panel.tsx    # Панель результатов
│   │   ├── errors-tab.tsx       # Вкладка ошибок
│   │   ├── seo-tab.tsx          # Вкладка SEO
│   │   ├── plagiarism-tab.tsx   # Вкладка плагиата
│   │   ├── style-tab.tsx        # Вкладка стиля
│   │   └── issue-card.tsx       # Карточка проблемы
│   └── shared/
│       ├── header.tsx           # Шапка
│       ├── footer.tsx           # Подвал
│       ├── privacy-toggle.tsx   # Тумблер приватности
│       └── language-select.tsx  # Выбор языка
│
├── lib/
│   ├── store/
│   │   ├── editor-store.ts      # Состояние редактора
│   │   ├── settings-store.ts    # Настройки
│   │   └── results-store.ts     # Результаты проверок
│   ├── analyzers/
│   │   ├── language-detector.ts # Определение языка
│   │   ├── ngram-analyzer.ts    # Анализ повторов
│   │   ├── readability.ts       # Читаемость
│   │   ├── seo-analyzer.ts      # SEO-анализ
│   │   └── style-checker.ts     # Проверка стиля
│   ├── file-handlers/
│   │   ├── import.ts            # Импорт файлов
│   │   └── export.ts            # Экспорт файлов
│   ├── validators/
│   │   └── schemas.ts           # Zod-схемы
│   └── utils.ts                 # Утилиты
│
├── hooks/
│   ├── use-check.ts             # Хук проверки текста
│   └── use-debounce.ts          # Debounce
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── __tests__/
│   ├── analyzers/
│   └── utils/
│
└── Docs/
    ├── ARCHITECTURE.md
    └── API.md
```

## 2. Компоненты shadcn/ui

| Компонент | Роль в приложении |
|-----------|-------------------|
| `textarea` | Основное поле ввода текста |
| `tabs` | Переключение вкладок результатов |
| `card` | Карточки проблем и блоки результатов |
| `button` | Все кнопки действий |
| `select` | Выбор языка RU/EN |
| `switch` | Тумблер "Не отправлять текст" |
| `badge` | Метки типов ошибок и статусов |
| `tooltip` | Подсказки к элементам |
| `dialog` | Модальные окна (импорт, экспорт) |
| `dropdown-menu` | Меню экспорта (.md/.docx) |
| `progress` | Прогресс проверки |
| `scroll-area` | Прокрутка списка ошибок |
| `separator` | Разделители секций |
| `skeleton` | Скелетоны при загрузке |
| `sonner` | Toast-уведомления |

## 3. Потоки данных

### 3.1 Ввод и редактирование текста

```
Textarea → onChange → EditorStore.setText()
                           ↓
                    localStorage (автосохранение)
                           ↓
                    detectLanguage() → EditorStore.setDetectedLanguage()
```

### 3.2 Проверка текста

```
Кнопка "Проверить" → useCheck hook
                         ↓
         ┌───────────────┼───────────────┐
         ↓               ↓               ↓
   /api/lt          /api/analyze    /api/plag
   (если !private)   (всегда)      (если !private)
         ↓               ↓               ↓
         └───────────────┼───────────────┘
                         ↓
              ResultsStore.setResults()
                         ↓
              EditorStore.setHighlights()
```

### 3.3 Применение исправления

```
IssueCard → "Применить" → EditorStore.applyReplacement(offset, length, text)
                                ↓
                          Пересчёт позиций → highlights.map(...)
```

## 4. API Endpoints

### POST /api/lt
Прокси к LanguageTool для проверки орфографии и грамматики.

```typescript
// Request
{ text: string, language: 'ru' | 'en' | 'auto' }

// Response
{
  matches: [{
    offset: number,
    length: number,
    message: string,
    replacements: [{ value: string }],
    rule: { id: string, category: { id: string } }
  }]
}
```

### POST /api/analyze
Локальные анализаторы текста.

```typescript
// Request
{
  text: string,
  language: 'ru' | 'en',
  keywords?: string[],
  checks: ('ngrams' | 'readability' | 'seo' | 'style')[]
}

// Response
{
  ngrams?: { ngram: string, count: number, positions: number[] }[],
  readability?: { avgSentenceLength: number, longWordsRatio: number, level: string },
  seo?: { keywords: { word: string, density: number, byParagraph: number[] }[], recommendations: string[] },
  style?: { type: string, offset: number, length: number, message: string, suggestion?: string }[]
}
```

### POST /api/plag
Проверка на плагиат через веб-поиск.

```typescript
// Request
{ text: string, language: 'ru' | 'en' }

// Response
{
  uniqueness: number,
  matches: [{
    phrase: string,
    sources: [{ url: string, title: string, similarity: number }]
  }]
}
```

## 5. Типы данных

```typescript
// Подсветка в тексте
interface Highlight {
  id: string
  offset: number
  length: number
  type: 'error' | 'style' | 'repeat' | 'seo' | 'plagiarism'
  severity: 'info' | 'warning' | 'error'
  message: string
  suggestions?: string[]
}

// Ошибка от LanguageTool
interface LTMatch {
  offset: number
  length: number
  message: string
  shortMessage?: string
  replacements: { value: string }[]
  rule: {
    id: string
    category: { id: string; name: string }
  }
}

// SEO-результат
interface SEOResult {
  keywords: KeywordAnalysis[]
  topLemmas: { word: string; count: number }[]
  recommendations: string[]
}

// Результат плагиата
interface PlagiarismResult {
  uniqueness: number
  matches: {
    phrase: string
    offset: number
    sources: { url: string; title: string; similarity: number }[]
  }[]
}

// Стилистическая проблема
interface StyleIssue {
  type: 'bureaucratic' | 'colloquial' | 'cliche' | 'caps' | 'passive'
  offset: number
  length: number
  text: string
  message: string
  suggestion?: string
}
```

## 6. Zustand Stores

### EditorStore
- `text: string` - текст редактора
- `language: 'ru' | 'en' | 'auto'` - выбранный язык
- `detectedLanguage: 'ru' | 'en' | null` - определённый язык
- `highlights: Highlight[]` - подсветки
- `activeHighlight: string | null` - активная подсветка

### SettingsStore
- `privateMode: boolean` - режим приватности
- `activeTab: string` - активная вкладка результатов

### ResultsStore
- `errors: LTMatch[]` - ошибки LanguageTool
- `ngrams: NgramResult[]` - повторы
- `readability: ReadabilityResult | null` - читаемость
- `seo: SEOResult | null` - SEO-анализ
- `plagiarism: PlagiarismResult | null` - плагиат
- `style: StyleIssue[]` - стилистические проблемы
- `isLoading: boolean` - статус загрузки
