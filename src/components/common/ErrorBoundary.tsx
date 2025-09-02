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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h3>Что-то пошло не так</h3>
          <p>Попробуйте обновить страницу. Мы уже записали информацию об ошибке.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
