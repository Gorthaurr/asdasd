/* ========================================
   TOAST NOTIFICATION UTILITY
   ======================================== */

interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  duration?: number;
  closable?: boolean;
}

const DEFAULT_DURATION = 5000;

// Эмодзи для разных типов
const TOAST_ICONS = {
  success: '✅',
  error: '❌', 
  warning: '⚠️',
  info: 'ℹ️'
};

// Создаем контейнер для тостов если его нет
function getToastContainer(): HTMLElement {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

// Показать тост
export function showToast(message: string, options: ToastOptions = {}) {
  const {
    type = 'info',
    title,
    duration = DEFAULT_DURATION,
    closable = true
  } = options;

  const container = getToastContainer();
  const toastId = `toast-${Date.now()}`;
  
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `toast ${type}`;
  
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-icon">${TOAST_ICONS[type]}</div>
      <div class="toast-text">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      ${closable ? '<button class="toast-close" onclick="closeToast(\'' + toastId + '\')">×</button>' : ''}
    </div>
  `;
  
  container.appendChild(toast);
  
  // Автоматическое удаление
  if (duration > 0) {
    setTimeout(() => {
      closeToast(toastId);
    }, duration);
  }
  
  return toastId;
}

// Закрыть тост
export function closeToast(toastId: string) {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.classList.add('removing');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
}

// Глобальная функция для использования в HTML
(window as any).closeToast = closeToast;

// Удобные методы для разных типов
export const toast = {
  success: (message: string, title?: string) => 
    showToast(message, { type: 'success', title }),
    
  error: (message: string, title?: string) => 
    showToast(message, { type: 'error', title }),
    
  warning: (message: string, title?: string) => 
    showToast(message, { type: 'warning', title }),
    
  info: (message: string, title?: string) => 
    showToast(message, { type: 'info', title })
};

// Замена стандартного alert
export function customAlert(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const titles = {
    success: 'Успешно!',
    error: 'Ошибка!', 
    info: 'Внимание!'
  };
  
  return showToast(message, { 
    type, 
    title: titles[type],
    duration: type === 'error' ? 7000 : 5000
  });
}

// Модальный алерт (как стандартный alert, но красивый)
export function modalAlert(message: string, title: string = 'Внимание', type: 'success' | 'error' | 'warning' | 'info' = 'info'): Promise<void> {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'modal-alert';
    
    modal.innerHTML = `
      <div class="modal-alert-content">
        <div class="modal-alert-header">
          <div class="modal-alert-icon">${TOAST_ICONS[type]}</div>
          <div class="modal-alert-title">${title}</div>
          <div class="modal-alert-message">${message}</div>
        </div>
        <div class="modal-alert-actions">
          <button class="modal-alert-btn primary" onclick="closeModal()">ОК</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Глобальная функция для закрытия
    (window as any).closeModal = () => {
      modal.remove();
      resolve();
    };
    
    // Закрытие по клику на фон
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        (window as any).closeModal();
      }
    });
  });
}
