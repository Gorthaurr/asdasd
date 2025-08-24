// Импортируем типы из React для классового компонента и детей
import { Component, ReactNode } from "react";

// Описываем пропсы: ErrorBoundary рендерит любых детей
type Props = { children: ReactNode };
// Описываем стейт: один флаг, произошла ли ошибка
type State = { hasError: boolean };

// Классовый Error Boundary: перехватывает ошибки рендера/лайфциклов потомков
export default class ErrorBoundary extends Component<Props, State> {
    // Инициализируем стейт: по умолчанию ошибок нет
    state: State = { hasError: false };

    // Статический хук жизненного цикла: переводит в «ошибочное» состояние при исключении
    static getDerivedStateFromError() {
        // Возвращаем новый стейт → компонент покажет fallback вместо детей
        return { hasError: true };
    }

    // Логирование подробностей (можно интегрировать Sentry/логгер)
    componentDidCatch(error: unknown, info: unknown) {
        // Выводим в консоль; здесь же можно отправлять на бэкенд/аналитику
        console.error("UI error:", error, info);
    }

    // Рендер: если произошла ошибка — показываем запасной UI; иначе — детей
    render() {
        if (this.state.hasError) {
            // Простой запасной UI, чтобы приложение не «падало» целиком
            return (
                <div style={{ padding: 24 }}>
                    <h3>Что-то пошло не так</h3>
                    <p>Попробуйте обновить страницу. Мы уже записали информацию об ошибке.</p>
                </div>
            );
        }
        // В штатном режиме просто рендерим детей
        return this.props.children;
    }
}
