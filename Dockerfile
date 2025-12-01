# ===================
# Этап 1: Установка зависимостей
# ===================
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ===================
# Этап 2: Сборка приложения
# ===================
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Собираем Next.js в standalone режиме
RUN npm run build

# ===================
# Этап 3: Продакшен образ (минимальный)
# ===================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Копируем только необходимое для запуска
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Запуск standalone сервера
CMD ["node", "server.js"]
