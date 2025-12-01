/**
 * Dynamic Navigation Component
 * Renders navigation based on user permissions
 */

import { getNavigationItems, getRoleDisplayName, getCurrentUserRole } from '../utils/rbac.js';
import { getAuthUser, clearAuthData } from '../utils/auth.js';

/**
 * Initialize and render the navigation bar
 * Should be called on page load
 */
export function initNavbar() {
  const nav = document.querySelector('.header-nav');
  if (!nav) {
    console.warn('Navigation element (.header-nav) not found');
    return;
  }

  // Get user and navigation items
  const user = getAuthUser();
  if (!user) {
    console.warn('No authenticated user found');
    return;
  }

  const navItems = getNavigationItems();
  const currentPage = window.location.pathname.split('/').pop();

  // Clear existing navigation
  nav.innerHTML = '';

  // Render navigation items
  navItems.forEach(item => {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;

    // Highlight current page
    if (item.href.includes(currentPage)) {
      link.classList.add('active');
    }

    nav.appendChild(link);
  });
}

/**
 * Update user info display in header
 * Shows user name and role
 */
export function updateUserInfo() {
  const user = getAuthUser();
  if (!user) return;

  const role = getCurrentUserRole();
  const roleName = getRoleDisplayName(role);

  // Find header-right container
  const headerRight = document.querySelector('.header-right');
  if (!headerRight) return;

  // Create user info section with role badge
  const userInfoHTML = `
    <div class="user-info">
      <span class="user-name">${user.name || user.email}</span>
      <span class="user-role-badge role-${role}">${roleName}</span>
    </div>
  `;

  // Find existing user info or create new one
  let userInfoContainer = headerRight.querySelector('.user-info');
  if (userInfoContainer) {
    userInfoContainer.outerHTML = userInfoHTML;
  } else {
    // Insert before logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.insertAdjacentHTML('beforebegin', userInfoHTML);
    } else {
      headerRight.insertAdjacentHTML('afterbegin', userInfoHTML);
    }
  }
}

/**
 * Initialize logout button
 * Adds click handler to logout button
 */
export function initLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (confirm('Tem certeza que deseja sair?')) {
      clearAuthData();
      window.location.href = '../index.html';
    }
  });
}

/**
 * Initialize all header components
 * Call this once on page load
 */
export function initHeader() {
  initNavbar();
  updateUserInfo();
  initLogoutButton();
}
