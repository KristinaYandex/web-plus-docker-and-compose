# Докеризация приложения
В этой проектной работе докеризировали сервис КупиПодариДай. Сервис состоит из трех частей:

1. докерезация бэкенд-сервиса на Node.js, БД (PostrgreSQL):
   - подготовка бэкенда к докеризации
   - описание переменных окружения (для JWT-секрет, для подключения БД)
   - использование базового образа node:16-alpine
   - подготовка сценария сборки и запуска образа бэкенда в Dockerfile
2. докерезация фронтенда на React:
   - использование базовых образов node:16-alpine и nginx:latest
   - подготовка сценария сборки и запуска nginx
3. сборка проекта воедино в файле docker-compose.yml(описание бекэнда, фронтенда, и базы данных)
4. развертывание сервиса на виртуальной машине в Яндекс Облаке:
   - установка Node.js
   - установка Docker и Docker Compose
   - загрузка проекта
   - выпуск сертификата SSL для шифрования данных
   - развертывание и запуск проекта при помощи команды docker-compose up -d и docker-compose up --build
   - 
# Технологии
- Docker
- Docker Compose
- Nginx
- TypeORM
- NestJS
- Node.js
- PostgreSQL
- Passport.js
- TypeScript

# Публикация приложения
- IP адрес 158.160.144.180
- Frontend https://kpd.ushakova.nomoredomainsmonster.ru
- Backend https://api.kpd.ushakova.nomoredomainsmonster.ru
