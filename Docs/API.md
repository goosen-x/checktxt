# TextCheck API Documentation

## Endpoints

### POST /api/lt

Проксирование запросов к LanguageTool для проверки орфографии и грамматики.

**Request:**
```json
{
  "text": "Текст для проверки",
  "language": "ru" | "en" | "auto"
}
```

**Response:**
```json
{
  "language": {
    "code": "ru",
    "name": "Russian",
    "detectedLanguage": {
      "code": "ru",
      "name": "Russian"
    }
  },
  "matches": [
    {
      "offset": 0,
      "length": 6,
      "message": "Возможная орфографическая ошибка",
      "shortMessage": "Орфография",
      "replacements": [
        { "value": "исправление" }
      ],
      "rule": {
        "id": "MORFOLOGIK_RULE_RU_RU",
        "category": {
          "id": "TYPOS",
          "name": "Орфография"
        }
      }
    }
  ]
}
```

**Errors:**
- `400` - Invalid request (text too long, missing parameters)
- `502` - LanguageTool service unavailable
- `503` - Cannot connect to LanguageTool server

---

### POST /api/analyze

Локальный анализ текста (повторы, читаемость, SEO, стиль).

**Request:**
```json
{
  "text": "Текст для анализа",
  "language": "ru" | "en",
  "keywords": ["ключ1", "ключ2"],
  "checks": ["ngrams", "readability", "seo", "style"]
}
```

**Response:**
```json
{
  "ngrams": [
    {
      "ngram": "повторяющаяся фраза",
      "count": 5,
      "positions": [10, 50, 100, 150, 200]
    }
  ],
  "readability": {
    "avgSentenceLength": 15.5,
    "longWordsRatio": 12.3,
    "sentenceCount": 10,
    "wordCount": 155,
    "level": "medium"
  },
  "seo": {
    "keywords": [
      {
        "word": "ключ1",
        "count": 5,
        "density": 2.5,
        "byParagraph": [1.2, 3.0, 2.8]
      }
    ],
    "topLemmas": [
      { "word": "система", "count": 8 },
      { "word": "данные", "count": 6 }
    ],
    "recommendations": [
      "Плотность ключа слишком низкая"
    ]
  },
  "style": [
    {
      "type": "bureaucratic",
      "offset": 10,
      "length": 15,
      "text": "в целях обеспечения",
      "message": "Канцеляризм",
      "suggestion": "чтобы обеспечить"
    }
  ]
}
```

**Errors:**
- `400` - Invalid request
- `500` - Internal server error

---

### POST /api/plag

Проверка на плагиат через веб-поиск.

**Request:**
```json
{
  "text": "Текст для проверки на плагиат",
  "language": "ru" | "en"
}
```

**Response:**
```json
{
  "uniqueness": 85,
  "checkedPhrases": 15,
  "matches": [
    {
      "phrase": "найденная фраза из текста",
      "offset": 100,
      "length": 25,
      "sources": [
        {
          "url": "https://example.com/article",
          "title": "Название статьи",
          "snippet": "...контекст совпадения...",
          "similarity": 75
        }
      ]
    }
  ]
}
```

**Errors:**
- `400` - Invalid request
- `500` - Internal server error

**Note:** Требует `SERP_API_KEY` в переменных окружения. Без ключа возвращает mock-данные.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LANGUAGETOOL_URL` | URL сервера LanguageTool | No (default: `http://localhost:8010`) |
| `SERP_API_KEY` | Ключ SerpAPI для плагиата | No (mock data without) |
| `NODE_ENV` | Окружение (development/production) | No |

---

## Running with Docker

```bash
cd docker
docker-compose up -d
```

Сервисы:
- App: http://localhost:3000
- LanguageTool: http://localhost:8010
