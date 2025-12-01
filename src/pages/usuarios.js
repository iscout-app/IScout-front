import { requireAuth } from '../utils/auth.js';
import { initHeader } from '../components/navbar.js';
import { initPageGuard } from '../utils/rbac.js';

// Verifica autenticação
if (!requireAuth()) {
    // Redireciona para login se não autenticado
}

// Guard: verifica permissão para cadastrar usuários (apenas admin)
initPageGuard('CADASTRAR_USUARIO');

// Inicializa header com navegação dinâmica
initHeader();

// Dados mock de usuários
let mockUsers = [
    { id: 1, name: 'João Silva', email: 'tecnico@iscout.com', password: 'tecnico123', userType: 'tecnico', status: 'ativo', phone: '(82) 99999-1111' },
    { id: 2, name: 'Maria Oliveira', email: 'olheiro@iscout.com', password: 'olheiro123', userType: 'olheiro', status: 'ativo', phone: '(82) 99999-2222' },
    { id: 3, name: 'Carlos Santos', email: 'responsavel@iscout.com', password: 'responsavel123', userType: 'responsavel', status: 'ativo', phone: '(82) 99999-3333' },
    { id: 4, name: 'Admin Sistema', email: 'admin@iscout.com', password: 'admin123', userType: 'admin', status: 'ativo', phone: '(82) 99999-9999' }
];

let nextId = 5;
let editingUserId = null;

// Elementos DOM
const usersGrid = document.getElementById('usersGrid');
const usersCount = document.getElementById('usersCount');
const emptyState = document.getElementById('emptyState');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Botões
const newUserBtn = document.getElementById('newUserBtn');

// Modal
const userModal = document.getElementById('userModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalSaveBtn = document.getElementById('modalSaveBtn');

// Form
const userForm = document.getElementById('userForm');
const userIdInput = document.getElementById('userId');
const userNameInput = document.getElementById('userNameField');
const userEmailInput = document.getElementById('userEmailField');
const userPasswordInput = document.getElementById('userPasswordField');
const userTypeInput = document.getElementById('userType');
const userStatusInput = document.getElementById('userStatus');
const userPhoneInput = document.getElementById('userPhone');

// Modal de exclusão
const deleteModal = document.getElementById('deleteModal');
const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const deleteModalClose = document.getElementById('deleteModalClose');
const deleteModalCancelBtn = document.getElementById('deleteModalCancelBtn');
const deleteModalConfirmBtn = document.getElementById('deleteModalConfirmBtn');
const deleteUserName = document.getElementById('deleteUserName');
let userToDelete = null;

// Renderiza lista de usuários
function renderUsers() {
    usersGrid.innerHTML = '';
    
    if (mockUsers.length === 0) {
        emptyState.style.display = 'flex';
        usersGrid.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        usersGrid.style.display = 'grid';
        
        mockUsers.forEach(user => {
            const card = createUserCard(user);
            usersGrid.appendChild(card);
        });
    }
    
    updateUsersCount();
}

// Cria card de usuário
function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    
    const userTypeLabels = {
        'tecnico': 'Técnico',
        'olheiro': 'Olheiro',
        'responsavel': 'Responsável',
        'admin': 'Administrador'
    };
    
    card.innerHTML = `
        <div class="user-card-header">
            <div class="user-avatar">${initials}</div>
            <div class="user-info">
                <span class="user-name-text">${user.name}</span>
                <span class="user-email">${user.email}</span>
            </div>
        </div>
        <div class="user-details">
            <div class="user-detail-item">
                <span class="detail-label">Tipo:</span>
                <span class="user-type-badge">${userTypeLabels[user.userType]}</span>
            </div>
            <div class="user-detail-item">
                <span class="detail-label">Status:</span>
                <span class="user-status ${user.status}">
                    <span class="status-dot"></span>
                    ${user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
            </div>
            ${user.phone ? `
                <div class="user-detail-item">
                    <span class="detail-label">Telefone:</span>
                    <span class="detail-value">${user.phone}</span>
                </div>
            ` : ''}
        </div>
        <div class="user-actions">
            <button onclick="editUser(${user.id})">✏️ Editar</button>
            <button onclick="confirmDeleteUser(${user.id})">🗑️ Excluir</button>
        </div>
    `;
    
    return card;
}

// Atualiza contador
function updateUsersCount() {
    const count = mockUsers.length;
    usersCount.textContent = `${count} usuário${count !== 1 ? 's' : ''}`;
}

// Novo usuário
newUserBtn.addEventListener('click', () => {
    openModal();
});

// Abre modal
function openModal(userId = null) {
    editingUserId = userId;
    
    if (userId) {
        // Modo edição
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return;
        
        modalTitle.textContent = 'Editar Usuário';
        userIdInput.value = user.id;
        userNameInput.value = user.name;
        userEmailInput.value = user.email;
        userPasswordInput.value = user.password;
        userPasswordInput.placeholder = 'Deixe em branco para manter a senha atual';
        userPasswordInput.required = false;
        userTypeInput.value = user.userType;
        userStatusInput.value = user.status;
        userPhoneInput.value = user.phone || '';
    } else {
        // Modo criação
        modalTitle.textContent = 'Novo Usuário';
        userForm.reset();
        userPasswordInput.placeholder = 'Mínimo 6 caracteres';
        userPasswordInput.required = true;
    }
    
    userModal.classList.add('show');
}

// Fecha modal
function closeModal() {
    userModal.classList.remove('show');
    userForm.reset();
    editingUserId = null;
}

modalClose.addEventListener('click', closeModal);
modalCancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Salvar usuário
modalSaveBtn.addEventListener('click', () => {
    if (!userForm.checkValidity()) {
        userForm.reportValidity();
        return;
    }
    
    const userData = {
        name: userNameInput.value.trim(),
        email: userEmailInput.value.trim(),
        password: userPasswordInput.value,
        userType: userTypeInput.value,
        status: userStatusInput.value,
        phone: userPhoneInput.value.trim()
    };
    
    // Validações
    if (!userData.name || !userData.email || !userData.userType) {
        showErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Verifica e-mail duplicado
    const existingUser = mockUsers.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase() && u.id !== editingUserId
    );
    
    if (existingUser) {
        showErrorMessage('Este e-mail já está cadastrado.');
        return;
    }
    
    if (editingUserId) {
        // Atualiza usuário existente
        const index = mockUsers.findIndex(u => u.id === editingUserId);
        if (index !== -1) {
            mockUsers[index] = {
                ...mockUsers[index],
                ...userData,
                // Só atualiza senha se foi preenchida
                password: userData.password || mockUsers[index].password
            };
            showSuccessMessage('Usuário atualizado com sucesso!');
        }
    } else {
        // Cria novo usuário
        if (!userData.password || userData.password.length < 6) {
            showErrorMessage('A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        
        const newUser = {
            id: nextId++,
            ...userData
        };
        
        mockUsers.push(newUser);
        showSuccessMessage('Usuário cadastrado com sucesso!');
    }
    
    closeModal();
    renderUsers();
});

// Editar usuário (global para onclick)
window.editUser = function(userId) {
    openModal(userId);
};

// Confirmar exclusão
window.confirmDeleteUser = function(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;
    
    userToDelete = userId;
    deleteUserName.textContent = user.name;
    deleteModal.classList.add('show');
};

// Cancelar exclusão
function closeDeleteModal() {
    deleteModal.classList.remove('show');
    userToDelete = null;
}

deleteModalClose.addEventListener('click', closeDeleteModal);
deleteModalCancelBtn.addEventListener('click', closeDeleteModal);
deleteModalOverlay.addEventListener('click', closeDeleteModal);

// Confirmar exclusão
deleteModalConfirmBtn.addEventListener('click', () => {
    if (userToDelete) {
        mockUsers = mockUsers.filter(u => u.id !== userToDelete);
        showSuccessMessage('Usuário excluído com sucesso!');
        closeDeleteModal();
        renderUsers();
    }
});

// Mensagens
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

// Inicializa
renderUsers();
