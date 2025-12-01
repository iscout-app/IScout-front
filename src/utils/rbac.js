/**
 * Role-Based Access Control (RBAC) Utility Module
 * Centralizes all permission logic and role management
 */

import { getAuthUser } from './auth.js';
import { ROLE_PERMISSIONS, hasPermission } from './permissions.js';

/**
 * Get the current user's role (standardized)
 * Handles both user.role (from backend) and user.userType (legacy frontend)
 * @returns {string|null} Role name or null if not authenticated
 */
export function getCurrentUserRole() {
  const user = getAuthUser();
  if (!user) return null;

  // Standardize: backend returns 'role', some frontend code uses 'userType'
  return user.role || user.userType || null;
}

/**
 * Get the current user's permission configuration
 * @returns {Object|null} Permission config object or null
 */
export function getCurrentUserPermissions() {
  const role = getCurrentUserRole();
  if (!role) return null;

  return ROLE_PERMISSIONS[role] || null;
}

/**
 * Check if current user can perform an action
 * @param {string} action - Action type: 'create', 'edit', 'delete', 'viewAll'
 * @returns {boolean}
 */
export function canUserPerformAction(action) {
  const permissions = getCurrentUserPermissions();
  if (!permissions) return false;

  const actionMap = {
    create: 'canCreate',
    edit: 'canEdit',
    delete: 'canDelete',
    viewAll: 'canViewAll',
  };

  const permissionKey = actionMap[action];
  return permissions[permissionKey] === true;
}

/**
 * Check if current user can access a specific page/feature
 * @param {string} permission - Permission name from permissions.js
 * @returns {boolean}
 */
export function canAccessFeature(permission) {
  const role = getCurrentUserRole();
  if (!role) return false;

  return hasPermission(role, permission);
}

/**
 * Initialize page-level access guard
 * Redirects to dashboard if user doesn't have required permission
 * @param {string} requiredPermission - Permission name required for this page
 */
export function initPageGuard(requiredPermission) {
  if (!canAccessFeature(requiredPermission)) {
    alert('Acesso negado! Você não tem permissão para acessar esta página.');
    window.location.href = './dashboard.html';
    return false;
  }
  return true;
}

/**
 * Filter data based on user's viewAll permission
 * Responsável users only see data linked to their email
 * @param {Array} data - Array of data objects
 * @param {string} emailField - Field name containing the email to match (default: 'emailResponsavel')
 * @returns {Array} Filtered data
 */
export function filterDataForCurrentUser(data, emailField = 'emailResponsavel') {
  const user = getAuthUser();
  if (!user) return [];

  const role = getCurrentUserRole();
  const permissions = getCurrentUserPermissions();

  // If user can view all, return everything
  if (permissions && permissions.canViewAll) {
    return data;
  }

  // Responsável only sees their own data
  if (role === 'responsavel') {
    return data.filter(item => item[emailField] === user.email);
  }

  return data;
}

/**
 * Hide an HTML element if user doesn't have permission
 * @param {HTMLElement} element - Element to hide
 * @param {string} action - Action type: 'create', 'edit', 'delete'
 */
export function hideElementIfNoPermission(element, action) {
  if (!element) return;

  if (!canUserPerformAction(action)) {
    element.style.display = 'none';
  }
}

/**
 * Get user-friendly role name
 * @param {string} role - Role identifier
 * @returns {string} Localized role name
 */
export function getRoleDisplayName(role) {
  const roleNames = {
    admin: 'Administrador',
    tecnico: 'Técnico',
    olheiro: 'Olheiro',
    responsavel: 'Responsável',
  };

  return roleNames[role] || 'Usuário';
}

/**
 * Check if current user is admin
 * @returns {boolean}
 */
export function isAdmin() {
  return getCurrentUserRole() === 'admin';
}

/**
 * Check if current user is responsavel
 * @returns {boolean}
 */
export function isResponsavel() {
  return getCurrentUserRole() === 'responsavel';
}

/**
 * Get navigation items based on current user's permissions
 * @returns {Array} Array of navigation items
 */
export function getNavigationItems() {
  const role = getCurrentUserRole();
  if (!role) return [];

  const allNavItems = [
    { label: 'Dashboard', href: './dashboard.html', permission: null }, // Always visible
    { label: 'Jogadores', href: './jogadores.html', permission: 'VISUALIZAR_JOGADORES' },
    { label: 'Cadastrar', href: './cadastro-jogador.html', permission: 'CADASTRAR_JOGADOR' },
    { label: 'Estatísticas', href: './estatisticas.html', permission: 'REGISTRAR_ESTATISTICA' },
    { label: 'Histórico', href: './historico.html', permission: 'VISUALIZAR_HISTORICO' },
    { label: 'Evolução', href: './evolucao.html', permission: 'VISUALIZAR_EVOLUCAO' },
    { label: 'Relatórios', href: './relatorios.html', permission: 'RELATORIOS_INDIVIDUAIS' },
    { label: 'Usuários', href: './usuarios.html', permission: 'CADASTRAR_USUARIO' },
  ];

  // Filter based on permissions
  return allNavItems.filter(item => {
    if (!item.permission) return true; // Always show items without permission requirement
    return canAccessFeature(item.permission);
  });
}
