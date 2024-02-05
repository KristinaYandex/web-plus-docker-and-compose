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
FROM nginx:latest as frontend
#рабочая директория внутри образа, где будет находиться приложение
WORKDIR /app
#копирование папки build из собранного проекта в папку nginx собранного образа 
COPY --from=builder /app/build /usr/share/nginx/html
#копирование конфигурационного файла nginx
COPY ./nginx/default.conf /etc/nginx/conf.d
#EXPOSE 80
#сборка проекта
ENTRYPOINT ["nginx", "-g", "daemon off;"]