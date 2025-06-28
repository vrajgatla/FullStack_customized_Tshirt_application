// Toast notification utility
class ToastManager {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 5000) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast);
    }, duration);

    return toast;
  }

  createToast(message, type) {
    const toast = document.createElement('div');
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const typeStyles = {
      success: 'bg-green-500 border-green-600',
      error: 'bg-red-500 border-red-600',
      warning: 'bg-yellow-500 border-yellow-600',
      info: 'bg-blue-500 border-blue-600'
    };

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.id = id;
    toast.className = `
      ${typeStyles[type]} text-white px-4 py-3 rounded-lg shadow-lg border-l-4
      transform transition-all duration-300 ease-in-out
      max-w-sm w-full flex items-center justify-between
      opacity-0 translate-x-full
    `;

    toast.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-lg">${icons[type]}</span>
        <span class="text-sm font-medium">${this.sanitizeMessage(message)}</span>
      </div>
      <button 
        onclick="document.getElementById('${id}').remove()"
        class="text-white hover:text-gray-200 transition-colors ml-2"
      >
        ✕
      </button>
    `;

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-x-full');
    });

    return toast;
  }

  remove(toast) {
    if (toast && toast.parentNode) {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300);
    }
  }

  removeAll() {
    this.toasts.forEach(toast => this.remove(toast));
  }

  sanitizeMessage(message) {
    const div = document.createElement('div');
    div.textContent = message;
    return div.innerHTML;
  }

  // Convenience methods
  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// Create singleton instance
const toast = new ToastManager();

// Export convenience functions
export const showToast = (message, type = 'info', duration = 5000) => {
  return toast.show(message, type, duration);
};

export const showSuccess = (message, duration = 5000) => {
  return toast.success(message, duration);
};

export const showError = (message, duration = 5000) => {
  return toast.error(message, duration);
};

export const showWarning = (message, duration = 5000) => {
  return toast.warning(message, duration);
};

export const showInfo = (message, duration = 5000) => {
  return toast.info(message, duration);
};

export const removeAllToasts = () => {
  toast.removeAll();
};

export default toast; 