# Руководство по стилю кода TechHome

## Быстрый старт

### Frontend (TypeScript/React)

#### Установка инструментов
```bash
cd TechHome
npm install --save-dev prettier eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

#### Автоматическое форматирование
```bash
# Форматирование всех файлов
npx prettier --write "src/**/*.{ts,tsx}"

# Проверка ESLint
npx eslint "src/**/*.{ts,tsx}"
```

#### Основные правила
- **Именование**: camelCase для переменных и функций, PascalCase для компонентов
- **Документация**: JSDoc комментарии для всех компонентов и функций
- **Импорты**: группировка по приоритету (React → внешние → внутренние)
- **Длина строки**: максимум 100 символов

## Ключевые принципы

### 1. Единообразие
- Все файлы следуют единому стилю
- Консистентные отступы и пробелы
- Соблюдение принятых соглашений

### 2. Читаемость
- Самодокументируемый код
- Понятные имена переменных и функций
- Комментарии для сложной логики

### 3. Поддерживаемость
- Логическое разделение кода
- Избежание дублирования
- Принцип единственной ответственности

## Примеры

### TypeScript/React
```typescript
/**
 * Компонент карточки товара
 * 
 * @param product - Объект товара для отображения
 * @returns JSX элемент карточки товара
 */
export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    const handleClick = useCallback(() => {
        // Логика обработки клика
    }, []);
    
    return (
        <article className="product-card">
            {/* Содержимое карточки */}
        </article>
    );
}
```

## Команды для проверки

### Frontend
```bash
# Форматирование
npm run format

# Проверка стиля
npm run lint

# Проверка типов
npm run type-check
```

## Полезные ссылки

- [Полное руководство по стилю](./CODE_STYLE_GUIDE.md)
- [Prettier документация](https://prettier.io/docs/en/)
- [ESLint правила](https://eslint.org/docs/rules/)
