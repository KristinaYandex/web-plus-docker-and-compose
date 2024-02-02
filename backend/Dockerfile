#базовый образ для сборки приложения
FROM node:16-alpine as builder
#рабочая директория внутри образа, где будет находиться приложение
WORKDIR /app
#копирование package.json и package.lock.json для установки зависимостей
COPY package*.json ./
#установка зависимостей, ci установить зависимости из lock файла, чтобы не было конфликтов версий
RUN npm ci --no-audit --no-fund
#копирование всех директорий и файлов из папки backend в папку /app
COPY . ./
#сборка проекта
RUN npm run build


#базовый образ для размещения на сервере
FROM node:16-alpine as backend
#рабочая директория внутри образа, где будет находиться приложение
WORKDIR /app
#копирование package.json и package.lock.json для установки зависимостей
COPY package*.json ./
#установка зависимостей, ci установить зависимости из lock файла, чтобы не было конфликтов версий, но без dev зависимостей
RUN npm ci --no-audit --no-fund --omit=dev && npm i -g pm2
#копирование папки dist из собранного проекта в папку образа
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js ./
#EXPOSE 4008
#сборка проекта
ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js"]