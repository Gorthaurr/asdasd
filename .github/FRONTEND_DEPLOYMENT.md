# Автоматический деплой фронтенда

## Настройка GitHub Actions

### 1. Секреты в GitHub

Добавьте в **Settings → Secrets and variables → Actions** (те же что для бэкенда):

```
SSH_HOST=195.133.196.30
SSH_USER=deploy
SSH_PORT=22
SSH_KEY=<приватный ключ deploy пользователя>
```

### 2. Настройка сервера

#### Структура директорий:
```bash
/home/deploy/frontend_dist/     # Временная папка для загрузки
/var/www/frontend/              # Основная папка веб-сервера
```

#### Права доступа:
```bash
# Пользователь deploy должен иметь права на запись в /home/deploy/
sudo chown -R deploy:deploy /home/deploy/

# Права на /var/www/frontend/ через sudo
# (скрипт автоматически устанавливает права www-data:www-data)
```

#### Настройка Caddy (если используется):
```bash
# Пример конфигурации Caddyfile
technofame.store {
    root * /var/www/frontend
    file_server
    
    # SPA routing
    try_files {path} /index.html
    
    # API proxy
    reverse_proxy /api/* https://api.technofame.store
}
```

### 3. Проверка деплоя

После настройки:
1. Сделайте push в main ветку
2. Проверьте Actions в GitHub
3. Проверьте сайт: https://technofame.store

## Процесс деплоя

1. **Сборка**: `pnpm run build`
2. **Копирование**: файлы из `dist/` → `/home/deploy/frontend_dist/`
3. **Деплой**: файлы → `/var/www/frontend/`
4. **Права**: `www-data:www-data`
5. **Перезагрузка**: `systemctl reload caddy`

## Troubleshooting

### Ошибки сборки:
- Проверьте `package.json` и `vite.config.ts`
- Проверьте зависимости в `pnpm-lock.yaml`
- Проверьте переменные окружения

### Ошибки копирования:
- Проверьте права на `/home/deploy/`
- Проверьте SSH соединение
- Проверьте размер `dist/` папки

### Ошибки деплоя:
- Проверьте права sudo для пользователя deploy
- Проверьте существование `/var/www/frontend/`
- Проверьте статус Caddy: `sudo systemctl status caddy`

### Ошибки веб-сервера:
- Проверьте логи Caddy: `sudo journalctl -u caddy -f`
- Проверьте права на файлы: `ls -la /var/www/frontend/`
- Проверьте конфигурацию Caddy: `sudo caddy validate --config /etc/caddy/Caddyfile`
