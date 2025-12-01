/**
 * Toast Notifications using Toastify
 * Library: https://github.com/apvarun/toastify-js
 *
 * Usage:
 * import { showToast } from './components/toast.js';
 *
 * showToast.success('Operação realizada com sucesso!');
 * showToast.error('Ops! Algo deu errado.');
 * showToast.warning('Atenção! Verifique os dados.');
 * showToast.info('Nova atualização disponível.');
 */

// Configuração padrão do Toastify
const defaultConfig = {
    duration: 4000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    close: true,
    style: {
        borderRadius: "8px",
        fontSize: "14px",
        padding: "16px 20px",
    }
};

export const showToast = {
    success: (message, duration) => {
        Toastify({
            text: message,
            ...defaultConfig,
            duration: duration || defaultConfig.duration,
            style: {
                ...defaultConfig.style,
                background: "linear-gradient(to right, #10b981, #059669)",
            }
        }).showToast();
    },

    error: (message, duration) => {
        Toastify({
            text: message,
            ...defaultConfig,
            duration: duration || defaultConfig.duration,
            style: {
                ...defaultConfig.style,
                background: "linear-gradient(to right, #ef4444, #dc2626)",
            }
        }).showToast();
    },

    warning: (message, duration) => {
        Toastify({
            text: message,
            ...defaultConfig,
            duration: duration || defaultConfig.duration,
            style: {
                ...defaultConfig.style,
                background: "linear-gradient(to right, #f59e0b, #d97706)",
            }
        }).showToast();
    },

    info: (message, duration) => {
        Toastify({
            text: message,
            ...defaultConfig,
            duration: duration || defaultConfig.duration,
            style: {
                ...defaultConfig.style,
                background: "linear-gradient(to right, #3b82f6, #2563eb)",
            }
        }).showToast();
    }
};

export default showToast;
