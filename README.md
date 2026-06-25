# DevFirm — Corporate Landing Site

React SPA с полноценной админ-панелью для управления контентом, темами, локализациями и медиа.

## Tech Stack

| Категория | Технология |
|-----------|-----------|
| Framework | React 19 + TypeScript 6 |
| Сборка | Vite 8 |
| Стили | Tailwind CSS 4 (`@tailwindcss/vite`) |
| State | Zustand 5 + `persist` (localStorage) |
| i18n | i18next + react-i18next (ru/uk/en) |
| Роутинг | React Router DOM 7 (lazy loading) |
| Анимации | Framer Motion |
| Линтинг | Oxlint |
| Тесты | Vitest + Testing Library |

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Dev-сервер с HMR (http://localhost:5173)
npm run dev

# Проверка типов + сборка
npm run build

# Просмотр продакшн-билда
npm run preview

# Тесты
npm test
```

## Структура проекта

```
src/
├── admin/                  # Админ-панель
│   ├── components/         # AdminLayout, Modal
│   ├── pages/              # Dashboard, Hero, About, Contact,
│   │                       # Projects, Services, Team, Testimonials,
│   │                       # Navigation, Gallery, Themes, Settings
│   ├── utils/              # imageDb (IndexedDB), imageProcessor (Canvas)
│   ├── i18n.ts             # Админ-переводы (ru/uk/en, ~200 ключей)
│   ├── themes.ts           # 5 цветовых тем + applyTheme/resetTheme
│   └── router.tsx          # Lazy-загрузка админ-страниц
├── components/
│   ├── layout/             # Header (Logo, Navigation, LangSwitch), Footer
│   ├── sections/           # Hero, About, Services, Portfolio, Team,
│   │                       # Testimonials, Contact
│   └── ui/                 # Button, Input, SocialLinks, Skeleton и др.
├── data/                   # Дефолтные данные (projects, testimonials)
├── hooks/                  # useCountUp и др.
├── i18n/                   # Сайт-переводы (ru/en/uk)
├── pages/                  # HomePage, PrivacyPage
├── stores/
│   ├── contentStore.ts     # Всё содержимое сайта (Zustand + localStorage)
│   └── adminAuthStore.ts   # Авторизация админки
├── styles/
│   └── globals.css         # @theme с CSS-переменными (цвета, тени, шрифты)
├── types/                  # TypeScript-интерфейсы
├── router.tsx              # Главный роутер
└── main.tsx                # Точка входа
```

## Админ-панель

Доступна по адресу `/admin`. Пароль по умолчанию: `admin`.

### Разделы

| Раздел | URL | Описание |
|--------|-----|----------|
| Дашборд | `/admin` | Обзор данных и статус i18n |
| Навигация | `/admin/navigation` | Управление пунктами меню: вкл/выкл, порядок, названия (ru/uk/en), целевые блоки |
| Hero | `/admin/hero` | Заголовок, подзаголовок (ru/uk/en), текст и цели двух CTA-кнопок |
| О компании | `/admin/about` | Текст секции (ru/uk/en), CRUD меток статистики с подписями на 3 языках |
| Контакты | `/admin/contact` | Лейблы формы (ru/uk/en), контактные данные |
| Проекты | `/admin/projects` | CRUD проектов с локализацией (title/description на ru/uk/en), категории/теги |
| Услуги | `/admin/services` | CRUD с i18n для названий, описаний, фич |
| Команда | `/admin/team` | CRUD участников с i18n |
| Отзывы | `/admin/testimonials` | CRUD с локализацией текста отзывов (ru/uk/en) |
| Галерея | `/admin/gallery` | Загрузка фото, авто-ресайз (Canvas API), хранение в IndexedDB, копирование data URL |
| Темы | `/admin/themes` | 5 цветовых тем с мгновенным применением |
| Настройки | `/admin/settings` | Компания, логотип, пароль, локали, соц. сети, экспорт/импорт JSON |

### Архитектура хранения

- **Контент** — `contentStore` (Zustand + localStorage persist). Все поля nullable с фолбэком на дефолтные данные.
- **i18n overrides** — `addResourceBundle()` при загрузке. Админка пишет в `i18nOverrides.{ru,en,uk}`, которые мержатся поверх статичных переводов.
- **Изображения** — IndexedDB (`site-gallery`), не ограничен 5 МБ localStorage. Data URL копируется и вставляется в поля `thumbnail`/`photo`.
- **Темы** — CSS custom properties на `document.documentElement.style`, применяются из `onRehydrateStorage`.

## Локализация

Сайт поддерживает 3 языка: русский, украинский, английский.

- В `/admin/settings` можно включить/выключить языки и задать дефолтный
- Переключатель языков в шапке сайта скрывается если включён только 1 язык
- Админ-панель имеет свою отдельную систему i18n с переключателем RU/UA/EN

## Темы

5 встроенных тем переключаются в `/admin/themes`:

| Тема | Стиль |
|------|-------|
| Blue (Default) | Синие тона, светлый фон |
| Emerald | Зелёные/изумрудные тона |
| Sunset | Тёплые оранжевые/янтарные |
| Midnight | Тёмная тема, индиго-акценты |
| Rose | Розово-фиолетовая палитра |

Применение: CSS-переменные из `globals.css` перезаписываются инлайн-стилями на `:root`.

## Публикация контента (site-config.json)

Админ-панель сохраняет данные в localStorage/IndexedDB **вашего** браузера. Чтобы контент стал доступен всем посетителям:

1. Настройте сайт через `/admin` (контент, темы, навигация, фото)
2. Перейдите в `/admin/settings` → **Экспорт JSON** — скачается `site-config.json`
3. Положите файл в `public/site-config.json`
4. Пересоберите и задеплойте: `npm run build`

При загрузке сайт проверяет `/site-config.json` — если файл существует и у посетителя нет данных в localStorage, конфиг применяется автоматически (тема, переводы, контент, изображения).

**Приоритет:** localStorage > site-config.json > дефолтные данные.

## Деплой

### Статический хостинг (Netlify, Vercel, GitHub Pages, Nginx)

Проект — чистый SPA без серверной части.

```bash
# 1. Экспортируйте конфиг из админки в public/site-config.json
# 2. Соберите
npm run build
```

Результат в `dist/`. Отдавайте `index.html` для всех маршрутов (SPA fallback).

### Netlify

Создайте `netlify.toml` в корне:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

Создайте `vercel.json` в корне:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Nginx

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/land/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэш статики
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### HestiaCP

Деплой на сервер с панелью [HestiaCP](https://hestiacp.com/). Hestia использует Nginx + Apache или чистый Nginx.

#### 1. Подготовка домена

В панели HestiaCP: **Web** → **Add Web Domain** → введите домен. Включите SSL (Let's Encrypt).

#### 2. Сборка (локально или на сервере)

**Вариант A — сборка локально, заливка файлов:**

```bash
# Локально
npm run build

# Загрузка на сервер (замените user, host, domain)
rsync -avz --delete dist/ user@host:/home/user/web/example.com/public_html/
```

**Вариант B — сборка на сервере:**

```bash
# SSH на сервер
ssh user@host

# Клонируем / обновляем проект
cd /tmp
git clone https://github.com/your/repo.git land
cd land
npm ci
npm run build

# Копируем в директорию сайта
rm -rf /home/user/web/example.com/public_html/*
cp -r dist/* /home/user/web/example.com/public_html/
```

> Путь `public_html` — стандартная директория для документов в HestiaCP. Если используется другой шаблон — проверьте через панель.

#### 3. Настройка Nginx для SPA

SPA требует отдавать `index.html` для всех маршрутов. В HestiaCP это делается через Nginx-шаблоны.

**Способ 1 — через Nginx Template (рекомендуется):**

Создайте SPA-шаблон для Nginx. Нужно два файла — `.tpl` (HTTP) и `.stpl` (HTTPS):

```bash
sudo nano /usr/local/hestia/data/templates/web/nginx/spa.tpl
```

```nginx
server {
    listen      %ip%:%proxy_port%;
    server_name %domain_idn% %alias_idn%;
    error_log   /var/log/%web_system%/domains/%domain%.error.log error;

    include %home%/%user%/conf/web/%domain%/nginx.forcessl.conf*;

    root %docroot%;
    index index.html;

    location ~ /\.(?!well-known\/|file) {
        deny all;
        return 404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location /error/ {
        alias %home%/%user%/web/%domain%/document_errors/;
    }

    include %home%/%user%/conf/web/%domain%/nginx.conf_*;
}
```

```bash
sudo nano /usr/local/hestia/data/templates/web/nginx/spa.stpl
```

```nginx
server {
    listen      %ip%:%proxy_ssl_port% ssl;
    server_name %domain_idn% %alias_idn%;
    error_log   /var/log/%web_system%/domains/%domain%.error.log error;

    ssl_certificate     %ssl_pem%;
    ssl_certificate_key %ssl_key%;

    # TLS 1.3 0-RTT anti-replay
    if ($anti_replay = 307) { return 307 https://$host$request_uri; }
    if ($anti_replay = 425) { return 425; }

    include %home%/%user%/conf/web/%domain%/nginx.hsts.conf*;

    root %docroot%;
    index index.html;

    location ~ /\.(?!well-known\/|file) {
        deny all;
        return 404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location /error/ {
        alias %home%/%user%/web/%domain%/document_errors/;
    }

    proxy_hide_header Upgrade;

    include %home%/%user%/conf/web/%domain%/nginx.ssl.conf_*;
}
```

Затем в панели HestiaCP: **Web** → ваш домен → **Edit** → **Advanced Options** → **Nginx Template** → выберите `spa`. Сохраните.

**Способ 2 — через nginx.conf_* файлы:**

> **Важно:** в HestiaCP файл `nginx.conf_location` включается **внутрь** уже существующего блока `location / { }`. Поэтому **нельзя** оборачивать содержимое в `location / { }` — это вызовет ошибку или цикл редиректов.

Создайте файл SPA fallback:

```bash
nano /home/user/conf/web/example.com/nginx.conf_location
```

С содержимым (только директива, **без** `location`-обёртки):

```nginx
try_files $uri $uri/ /index.html;
```

Для кэша статики создайте отдельный файл:

```bash
nano /home/user/conf/web/example.com/nginx.conf_pre
```

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
    root    /home/user/web/example.com/public_html;
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
}
```

Перезапустите Nginx:

```bash
sudo systemctl restart nginx
```

#### Диагностика ошибки "rewrite or internal redirection cycle"

Если видите в логах `rewrite or internal redirection cycle while internally redirecting to "/index.html"`:

1. **Файл не скопирован** — проверьте `ls /home/user/web/example.com/public_html/index.html`
2. **Двойная обёртка** — в `nginx.conf_location` не должно быть `location / { }`, только `try_files ...`
3. **Проверить итоговый конфиг** — `cat /home/user/conf/web/example.com/nginx.conf` покажет собранный конфиг
4. **Права** — `chown -R user:user /home/user/web/example.com/public_html/`

#### 4. Проверка

Откройте `https://example.com` — должен загрузиться сайт. Перейдите на `https://example.com/admin` — должна открыться админка (а не 404).

#### Обновление

```bash
# Локальная сборка + заливка
npm run build
rsync -avz --delete dist/ user@host:/home/user/web/example.com/public_html/
```

Никакого рестарта сервера не нужно — это статические файлы.

### Docker

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t devfirm .
docker run -p 80:80 devfirm
```

## Контактная форма

Форма в `#contact` пытается отправить POST на `/api/contact`. Если бэкенд недоступен — открывает `mailto:` как фолбэк. Для подключения реального бэкенда замените URL в `ContactForm.tsx`.

## NPM-скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с HMR |
| `npm run build` | Проверка типов + production-сборка |
| `npm run preview` | Локальный просмотр билда |
| `npm run lint` | Oxlint |
| `npm test` | Vitest (однократно) |
| `npm run test:watch` | Vitest в watch-режиме |
