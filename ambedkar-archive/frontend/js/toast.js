/**
 * toast.js — Ask-Sonner & Emil Kowalski Fluid Archival Toast System
 * Tactile micro-notifications with spring physics, specular highlight, and auto-dismiss
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 380px;
        width: calc(100% - 48px);
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  show(message, type = 'info', duration = 3500) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    const borderColor = 
      type === 'success' ? '#10b981' : 
      type === 'error' ? '#ef4444' : 
      type === 'warning' ? '#f59e0b' : '#d4af37';

    // Apple Multimodal Haptic Feedback
    if (window.ApplePhysics && typeof window.ApplePhysics.haptic === 'function') {
      window.ApplePhysics.haptic(type === 'error' ? 'warning' : type === 'success' ? 'success' : 'light');
    }

    toast.style.cssText = `
      pointer-events: auto;
      background: rgba(14, 18, 28, 0.94);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-left: 3px solid ${borderColor};
      color: #f8fafc;
      padding: 12px 18px;
      border-radius: 14px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.16);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      animation: sonnerToastIn 0.28s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      position: relative;
      overflow: hidden;
    `;

    const icon = type === 'success' ? '✦' : type === 'error' ? '✕' : type === 'warning' ? '▲' : '⚜️';

    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1rem; color:${borderColor};">${icon}</span>
        <span>${message}</span>
      </div>
      <button style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1.1rem; padding:0; display:flex; align-items:center;" onclick="this.parentElement.remove()">×</button>
      <div class="toast-progress" style="
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: ${borderColor};
        width: 100%;
        animation: sonnerToastProgress ${duration}ms linear forwards;
      "></div>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'sonnerToastOut 0.22s cubic-bezier(0.77, 0, 0.175, 1) forwards';
      setTimeout(() => toast.remove(), 220);
    }, duration);
  }

  success(msg) { this.show(msg, 'success'); }
  error(msg) { this.show(msg, 'error'); }
  warning(msg) { this.show(msg, 'warning'); }
  info(msg) { this.show(msg, 'info'); }
}

// Inject CSS animations for Toast Manager
const style = document.createElement('style');
style.textContent = `
  @keyframes sonnerToastIn {
    from { opacity: 0; transform: translateY(14px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes sonnerToastOut {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(10px) scale(0.96); }
  }
  @keyframes sonnerToastProgress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
document.head.appendChild(style);

window.toast = new ToastManager();
