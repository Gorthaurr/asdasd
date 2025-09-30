#!/bin/bash

# SEO Check Script для technofame.store
# Проверяет, что боты видят полный HTML

echo "🔍 Проверка SEO для technofame.store"
echo "=================================="

# 1. Проверка заголовков
echo "📋 Заголовки ответа:"
curl -sI https://technofame.store/ | head -10

echo -e "\n"

# 2. Проверка для обычного пользователя
echo "👤 Обычный пользователь (первые 20 строк):"
curl -s https://technofame.store/ | head -20

echo -e "\n"

# 3. Проверка для Googlebot
echo "🤖 Googlebot (первые 20 строк):"
curl -A "Googlebot/2.1" -s https://technofame.store/ | head -20

echo -e "\n"

# 4. Проверка мета-тегов
echo "🏷️ Мета-теги:"
curl -s https://technofame.store/ | grep -E "<title>|<meta.*description|<meta.*og:" | head -10

echo -e "\n"

# 5. Проверка контента
echo "📄 Видимый контент:"
curl -s https://technofame.store/ | grep -E "<h1>|<h2>|<p>|<div.*>" | head -10

echo -e "\n"

# 6. Проверка размера ответа
echo "📊 Размер ответа:"
curl -s https://technofame.store/ | wc -c
echo "байт"

echo -e "\n"

# 7. Проверка статуса
echo "✅ Статус:"
if curl -s https://technofame.store/ | grep -q "TechnoFame"; then
    echo "✅ Контент найден - SEO работает!"
else
    echo "❌ Контент не найден - нужен пререндер!"
fi

echo -e "\n"
echo "🔧 Для исправления используйте:"
echo "1. Next.js миграцию (MIGRATION_TO_NEXTJS.md)"
echo "2. Nginx + Rendertron (NGINX_RENDERTRON_SETUP.md)"
