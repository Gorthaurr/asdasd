import { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('UI error:', error, info);
    console.error('Current URL:', window.location.href);
    console.error('Redux state:', (window as any).store?.getState?.());
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="modal-alert">
          <div className="modal-alert-content">
            <div className="modal-alert-header">
              <div className="modal-alert-icon">😵</div>
              <div className="modal-alert-title">Что-то пошло не так</div>
              <div className="modal-alert-message">
                Попробуйте обновить страницу. Мы уже записали информацию об ошибке.
              </div>
            </div>
            <div className="modal-alert-actions">
              <button 
                className="modal-alert-btn primary"
                onClick={() => window.location.href = '/'}
              >
                🏠 Вернуться на главную
              </button>
              <button 
                className="modal-alert-btn secondary"
                onClick={() => window.location.reload()}
              >
                🔄 Обновить страницу
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
