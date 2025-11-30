// Limits
export const CHAR_LIMIT = 15000
export const AUTOSAVE_DELAY = 1000
export const DEBOUNCE_DELAY = 300

// N-gram settings
export const NGRAM_MIN_COUNT = 3
export const NGRAM_MAX_N = 3

// Readability thresholds
export const LONG_WORD_MIN_LENGTH = 7
export const EASY_AVG_SENTENCE = 12
export const HARD_AVG_SENTENCE = 20

// SEO settings
export const MIN_KEYWORD_DENSITY = 0.5
export const MAX_KEYWORD_DENSITY = 3.0
export const TOP_LEMMAS_COUNT = 10

// Plagiarism settings
export const PLAG_PHRASE_LENGTH = { min: 5, max: 8 }
export const PLAG_MAX_PHRASES = 20

// Style dictionaries - Russian
export const BUREAUCRATIC_RU: { pattern: RegExp; message: string; suggestion?: string }[] = [
  { pattern: /в целях обеспечения/gi, message: 'Канцеляризм', suggestion: 'чтобы обеспечить' },
  { pattern: /в связи с тем,? что/gi, message: 'Канцеляризм', suggestion: 'потому что' },
  { pattern: /в настоящее время/gi, message: 'Канцеляризм', suggestion: 'сейчас' },
  { pattern: /на сегодняшний день/gi, message: 'Канцеляризм', suggestion: 'сейчас' },
  { pattern: /в рамках/gi, message: 'Канцеляризм', suggestion: 'в' },
  { pattern: /осуществлять деятельность/gi, message: 'Канцеляризм', suggestion: 'работать' },
  { pattern: /производить работы/gi, message: 'Канцеляризм', suggestion: 'работать' },
  { pattern: /оказывать содействие/gi, message: 'Канцеляризм', suggestion: 'помогать' },
  { pattern: /принимать участие/gi, message: 'Канцеляризм', suggestion: 'участвовать' },
  { pattern: /иметь место/gi, message: 'Канцеляризм', suggestion: 'быть' },
  { pattern: /данный/gi, message: 'Канцеляризм', suggestion: 'этот' },
  { pattern: /вышеуказанн/gi, message: 'Канцеляризм', suggestion: 'этот' },
  { pattern: /нижеследующ/gi, message: 'Канцеляризм', suggestion: 'следующий' },
  { pattern: /надлежащим образом/gi, message: 'Канцеляризм', suggestion: 'правильно' },
  { pattern: /в случае если/gi, message: 'Канцеляризм', suggestion: 'если' },
  { pattern: /при условии,? что/gi, message: 'Канцеляризм', suggestion: 'если' },
  { pattern: /в силу того,? что/gi, message: 'Канцеляризм', suggestion: 'потому что' },
  { pattern: /ввиду того,? что/gi, message: 'Канцеляризм', suggestion: 'потому что' },
  { pattern: /с точки зрения/gi, message: 'Канцеляризм', suggestion: 'по мнению' },
  { pattern: /по причине того,? что/gi, message: 'Канцеляризм', suggestion: 'потому что' },
  { pattern: /осуществлять контроль/gi, message: 'Канцеляризм', suggestion: 'контролировать' },
  { pattern: /производить оплату/gi, message: 'Канцеляризм', suggestion: 'платить' },
  { pattern: /осуществлять поставку/gi, message: 'Канцеляризм', suggestion: 'поставлять' },
  { pattern: /в соответствии с/gi, message: 'Канцеляризм', suggestion: 'по' },
  { pattern: /согласно имеющимся данным/gi, message: 'Канцеляризм', suggestion: 'по данным' },
  { pattern: /является/gi, message: 'Канцеляризм (возможно)', suggestion: 'это' },
  { pattern: /представляет собой/gi, message: 'Канцеляризм', suggestion: 'это' },
  { pattern: /играет роль/gi, message: 'Канцеляризм', suggestion: '' },
  { pattern: /имеет значение/gi, message: 'Канцеляризм', suggestion: 'важен' },
  { pattern: /представляется возможным/gi, message: 'Канцеляризм', suggestion: 'можно' },
]

export const CLICHE_RU: { pattern: RegExp; message: string }[] = [
  { pattern: /как показывает практика/gi, message: 'Клише' },
  { pattern: /не секрет,? что/gi, message: 'Клише' },
  { pattern: /само собой разумеется/gi, message: 'Клише' },
  { pattern: /не для кого не секрет/gi, message: 'Клише' },
  { pattern: /в конечном (итоге|счёте|счете)/gi, message: 'Клише' },
  { pattern: /по большому счёту/gi, message: 'Клише' },
  { pattern: /по большому счету/gi, message: 'Клише' },
  { pattern: /как правило/gi, message: 'Клише' },
  { pattern: /в первую очередь/gi, message: 'Клише' },
  { pattern: /прежде всего/gi, message: 'Клише' },
  { pattern: /в целом и общем/gi, message: 'Клише' },
  { pattern: /как известно/gi, message: 'Клише' },
  { pattern: /в ногу со временем/gi, message: 'Клише' },
  { pattern: /взять на вооружение/gi, message: 'Клише' },
  { pattern: /краеугольный камень/gi, message: 'Клише' },
  { pattern: /в эпоху (перемен|изменений)/gi, message: 'Клише' },
  { pattern: /качественный скачок/gi, message: 'Клише' },
  { pattern: /выйти на новый уровень/gi, message: 'Клише' },
  { pattern: /вектор развития/gi, message: 'Клише' },
  { pattern: /широкий спектр/gi, message: 'Клише' },
]

// Note: \b doesn't work with Cyrillic in JS, using lookahead/lookbehind instead
export const COLLOQUIAL_RU: { pattern: RegExp; message: string }[] = [
  { pattern: /(?<![а-яёА-ЯЁ])короче(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])типа(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])ваще(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])чё(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])нету(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])щас(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])прикольн/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])офигенн/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])крутой(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово (в неформальном значении)' },
  { pattern: /(?<![а-яёА-ЯЁ])крутая(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово (в неформальном значении)' },
  { pattern: /(?<![а-яёА-ЯЁ])круто(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово' },
  { pattern: /(?<![а-яёА-ЯЁ])чисто(?![а-яёА-ЯЁ])/gi, message: 'Разговорное слово (в значении "только")' },
  { pattern: /как бы/gi, message: 'Слово-паразит' },
  { pattern: /так сказать/gi, message: 'Слово-паразит' },
  { pattern: /(?<![а-яёА-ЯЁ])ну(?=\s*,)/gi, message: 'Слово-паразит' },
]

// Passive voice patterns - Russian
export const PASSIVE_RU: { pattern: RegExp; message: string }[] = [
  { pattern: /был[оаи]?\s+\w+[аоые]н[оаые]?\b/gi, message: 'Пассивная конструкция' },
  { pattern: /будет\s+\w+[аоые]н[оаые]?\b/gi, message: 'Пассивная конструкция' },
  { pattern: /было\s+принято\s+решение/gi, message: 'Пассивная конструкция', },
  { pattern: /было\s+решено/gi, message: 'Пассивная конструкция' },
  { pattern: /было\s+установлено/gi, message: 'Пассивная конструкция' },
  { pattern: /было\s+выявлено/gi, message: 'Пассивная конструкция' },
  { pattern: /было\s+определено/gi, message: 'Пассивная конструкция' },
]

// Style dictionaries - English
export const BUREAUCRATIC_EN: { pattern: RegExp; message: string; suggestion?: string }[] = [
  { pattern: /in order to/gi, message: 'Wordy phrase', suggestion: 'to' },
  { pattern: /due to the fact that/gi, message: 'Wordy phrase', suggestion: 'because' },
  { pattern: /at this point in time/gi, message: 'Wordy phrase', suggestion: 'now' },
  { pattern: /in the event that/gi, message: 'Wordy phrase', suggestion: 'if' },
  { pattern: /for the purpose of/gi, message: 'Wordy phrase', suggestion: 'for' },
  { pattern: /with regard to/gi, message: 'Wordy phrase', suggestion: 'about' },
  { pattern: /in accordance with/gi, message: 'Wordy phrase', suggestion: 'by' },
  { pattern: /prior to/gi, message: 'Wordy phrase', suggestion: 'before' },
  { pattern: /subsequent to/gi, message: 'Wordy phrase', suggestion: 'after' },
  { pattern: /in the near future/gi, message: 'Wordy phrase', suggestion: 'soon' },
  { pattern: /at the present time/gi, message: 'Wordy phrase', suggestion: 'now' },
  { pattern: /is able to/gi, message: 'Wordy phrase', suggestion: 'can' },
  { pattern: /has the ability to/gi, message: 'Wordy phrase', suggestion: 'can' },
  { pattern: /it is important to note that/gi, message: 'Wordy phrase', suggestion: 'notably' },
  { pattern: /it should be noted that/gi, message: 'Wordy phrase', suggestion: '' },
  { pattern: /make a decision/gi, message: 'Wordy phrase', suggestion: 'decide' },
  { pattern: /come to a conclusion/gi, message: 'Wordy phrase', suggestion: 'conclude' },
  { pattern: /conduct an investigation/gi, message: 'Wordy phrase', suggestion: 'investigate' },
  { pattern: /give consideration to/gi, message: 'Wordy phrase', suggestion: 'consider' },
  { pattern: /take into consideration/gi, message: 'Wordy phrase', suggestion: 'consider' },
]

export const CLICHE_EN: { pattern: RegExp; message: string }[] = [
  { pattern: /at the end of the day/gi, message: 'Cliche' },
  { pattern: /think outside the box/gi, message: 'Cliche' },
  { pattern: /low-hanging fruit/gi, message: 'Cliche' },
  { pattern: /paradigm shift/gi, message: 'Cliche' },
  { pattern: /synergy/gi, message: 'Business cliche' },
  { pattern: /move the needle/gi, message: 'Cliche' },
  { pattern: /circle back/gi, message: 'Business cliche' },
  { pattern: /touch base/gi, message: 'Business cliche' },
  { pattern: /best practices/gi, message: 'Business cliche' },
  { pattern: /game changer/gi, message: 'Cliche' },
  { pattern: /win-win/gi, message: 'Cliche' },
  { pattern: /take it to the next level/gi, message: 'Cliche' },
  { pattern: /cutting edge/gi, message: 'Cliche' },
  { pattern: /state of the art/gi, message: 'Cliche' },
  { pattern: /pushing the envelope/gi, message: 'Cliche' },
]

// Passive voice patterns - English
export const PASSIVE_EN: { pattern: RegExp; message: string }[] = [
  { pattern: /\b(is|are|was|were|been|being)\s+\w+ed\b/gi, message: 'Passive voice' },
  { pattern: /\b(is|are|was|were)\s+(being\s+)?\w+en\b/gi, message: 'Passive voice' },
]

// CAPS and exclamation patterns
export const CAPS_PATTERN = /[A-ZА-ЯЁ]{4,}/g
export const EXCLAMATION_PATTERN = /!{2,}|[!?]{2,}/g

// LanguageTool API
export const LT_DEFAULT_URL = 'https://api.languagetool.org'
