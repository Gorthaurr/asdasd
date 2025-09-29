# 📁 Папка для иконок TechnoFame

## 🎯 Назначение
Эта папка содержит все иконки и изображения для сайта TechnoFame.

## 📋 Необходимые файлы

### ✅ Уже созданы:
- `favicon.svg` - основная SVG иконка
- `site.webmanifest` - манифест для PWA

### 🔄 Нужно добавить (создать PNG версии):

#### Favicon (иконка вкладки):
- `favicon-16x16.png` - 16x16 пикселей
- `favicon-32x32.png` - 32x32 пикселей
- `favicon.ico` - классический favicon

#### Apple Touch Icon:
- `apple-touch-icon.png` - 180x180 пикселей

#### Android Chrome:
- `android-chrome-192x192.png` - 192x192 пикселей
- `android-chrome-512x512.png` - 512x512 пикселей

#### Open Graph (для соцсетей):
- `og-image.png` - 1200x630 пикселей (для превью в соцсетях)

## 🛠️ Как создать PNG версии:

### Вариант 1: Онлайн конвертер
1. Зайдите на https://convertio.co/svg-png/
2. Загрузите `favicon.svg`
3. Выберите нужные размеры
4. Скачайте PNG файлы

### Вариант 2: Figma/Photoshop
1. Откройте `favicon.svg` в редакторе
2. Экспортируйте в нужных размерах
3. Сохраните как PNG

### Вариант 3: Командная строка (если установлен ImageMagick)
```bash
# 16x16
magick favicon.svg -resize 16x16 favicon-16x16.png

# 32x32
magick favicon.svg -resize 32x32 favicon-32x32.png

# 180x180 (Apple)
magick favicon.svg -resize 180x180 apple-touch-icon.png

# 192x192 (Android)
magick favicon.svg -resize 192x192 android-chrome-192x192.png

# 512x512 (Android)
magick favicon.svg -resize 512x512 android-chrome-512x512.png

# 1200x630 (Open Graph)
magick favicon.svg -resize 1200x630 og-image.png
```

## 🎨 Дизайн иконки
- **Цвета**: Золотой градиент (#d4af37 → #e6c34a)
- **Стиль**: Минималистичный, современный
- **Элементы**: Буква "T" + декоративные точки
- **Фон**: Золотой градиент с закругленными углами

## 📱 Поддержка устройств
- ✅ Desktop браузеры (Chrome, Firefox, Safari, Edge)
- ✅ Мобильные браузеры (iOS Safari, Chrome Mobile)
- ✅ PWA (Progressive Web App)
- ✅ Социальные сети (Facebook, Twitter, LinkedIn)
- ✅ Поисковые системы (Google, Yandex)

## 🔧 Технические детали
- **Формат**: SVG (векторный) + PNG (растровый)
- **Размеры**: от 16x16 до 512x512 пикселей
- **Оптимизация**: сжатие без потери качества
- **Кэширование**: браузеры кэшируют иконки
