# Руководство по стилю кода TechHome

## Общие принципы

### 1. Единообразие
- Все файлы должны следовать единому стилю именования и форматирования
- Используйте консистентные отступы и пробелы
- Соблюдайте принятые в проекте соглашения

### 2. Читаемость
- Код должен быть самодокументируемым
- Используйте понятные имена переменных и функций
- Добавляйте комментарии для сложной логики

### 3. Поддерживаемость
- Разделяйте код на логические блоки
- Избегайте дублирования кода
- Следуйте принципу единственной ответственности

## TypeScript/React (Frontend)

### Именование

#### Файлы и папки
```
components/
├── layout/
│   ├── Header.tsx
│   └── Footer.tsx
├── products/
│   └── ProductCard.tsx
└── common/
    └── ErrorBoundary.tsx

features/
├── cart/
│   └── cartSlice.ts
└── catalog/
    └── catalogSlice.ts

utils/
├── format.ts
└── storage.ts
```

#### Переменные и функции
```typescript
// ✅ Правильно
const productName = 'Техника';
const isProductAvailable = true;
const handleProductClick = () => {};

// ❌ Неправильно
const pn = 'Техника';
const available = true;
const click = () => {};
```

#### Компоненты
```typescript
// ✅ Правильно
export default function ProductCard({ product }: ProductCardProps) {
    // ...
}

// ❌ Неправильно
export default function ProductCard({ p }: { p: Product }) {
    // ...
}
```

### Документация

#### JSDoc комментарии
```typescript
/**
 * Компонент карточки товара
 * 
 * Отображает основную информацию о товаре с возможностью:
 * - Перехода на страницу товара
 * - Добавления в избранное
 * - Управления количеством в корзине
 * 
 * @param product - Объект товара для отображения
 * @returns JSX элемент карточки товара
 */
export default function ProductCard({ product }: ProductCardProps) {
    // ...
}
```

#### Интерфейсы
```typescript
/**
 * Пропсы для компонента карточки товара
 */
interface ProductCardProps {
    /** Объект товара для отображения */
    product: Product;
    /** Обработчик клика по карточке */
    onClick?: (product: Product) => void;
}
```

### Структура файлов

#### Импорты (в порядке приоритета)
```typescript
// 1. React и основные библиотеки
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// 2. Внешние библиотеки
import axios from 'axios';

// 3. Внутренние компоненты
import ProductCard from '../components/products/ProductCard';

// 4. Утилиты и типы
import { formatCurrency } from '../../utils/format';
import type { Product } from '../../types/product';

// 5. Стили (если есть)
import './ProductList.css';
```

#### Организация кода
```typescript
// 1. Типы и интерфейсы
interface ComponentProps {
    // ...
}

// 2. Константы
const DEFAULT_PAGE_SIZE = 20;

// 3. Утилитарные функции
const formatData = (data: any) => {
    // ...
};

// 4. Основной компонент
export default function Component({ prop }: ComponentProps) {
    // 4.1. Хуки состояния
    const [state, setState] = useState();
    
    // 4.2. Хуки эффектов
    useEffect(() => {
        // ...
    }, []);
    
    // 4.3. Обработчики событий
    const handleClick = () => {
        // ...
    };
    
    // 4.4. Вычисляемые значения
    const computedValue = useMemo(() => {
        // ...
    }, []);
    
    // 4.5. Рендер
    return (
        // ...
    );
}
```

## Комментарии

### Общие правила
- Используйте комментарии для объяснения "почему", а не "что"
- Обновляйте комментарии при изменении кода
- Избегайте избыточных комментариев

### TODO комментарии
```typescript
// TODO: Добавить валидацию email при регистрации
// FIXME: Исправить утечку памяти в компоненте
// NOTE: Временное решение, заменить на WebSocket
```

## Форматирование

### TypeScript/React
- Используйте Prettier для автоматического форматирования
- Максимальная длина строки: 100 символов
- Отступы: 2 пробела
- Точка с запятой в конце строк

## Тестирование

### TypeScript/React
```typescript
/**
 * Тесты для компонента ProductCard
 */
describe('ProductCard', () => {
    it('should render product information correctly', () => {
        // ...
    });
    
    it('should handle add to cart click', () => {
        // ...
    });
});
```

## Безопасность

### Общие принципы
- Валидируйте все входные данные
- Используйте параметризованные запросы
- Обрабатывайте ошибки безопасно
- Не раскрывайте чувствительную информацию в логах

### TypeScript/React
```typescript
// ✅ Правильно
const sanitizedInput = DOMPurify.sanitize(userInput);
const encodedUrl = encodeURIComponent(url);

// ❌ Неправильно
const html = `<div>${userInput}</div>`;
```

## Производительность

### TypeScript/React
- Используйте React.memo для оптимизации ре-рендеров
- Применяйте useMemo и useCallback для дорогих вычислений
- Избегайте создания объектов в рендере

## Логирование

### TypeScript/React
```typescript
// ✅ Правильно
console.log('Product loaded:', { id: product.id, name: product.name });
console.error('Failed to load product:', error);

// ❌ Неправильно
console.log('Product:', product);
console.log('Error:', error);
```

Это руководство должно соблюдаться всеми разработчиками проекта для обеспечения единообразия и качества кода.
