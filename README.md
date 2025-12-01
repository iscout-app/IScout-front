# ⚽ IScout Frontend v2.0

Sistema de Scout de Jovens Jogadores - Frontend moderno com Bun, TypeScript e HMR.

## 🚀 Quick Start

```bash
# Instalar dependências
bun install

# Desenvolvimento (HMR ativo)
bun run dev
# → http://localhost:5173
```

## ✨ O Que Mudou na v2.0?

###Before (v1.0)
- ❌ Servidor HTTP simples sem HMR
- ❌ JavaScript vanilla sem types
- ❌ Sem ferramentas de desenvolvimento

### Agora (v2.0)
- ✅ **Bun Server** com Hot Module Replacement
- ✅ **TypeScript** com tipos completos
- ✅ **ESLint + Prettier** configurados
- ✅ **API Proxy** integrado (sem CORS)

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Linguagem**: TypeScript 5.x
- **Linting**: ESLint + Prettier
- **Libraries**: Chart.js, Toastify.js

## 📡 API Integration

O servidor inclui proxy automático para o backend:

```
Frontend: http://localhost:5173
Backend:  http://localhost:3000

Requests /v1/* → automaticamente proxy para backend
```

## 🔧 Scripts

```bash
bun run dev      # Desenvolvimento com HMR
bun start        # Produção
bun run lint     # Verificar código
bun run format   # Formatar código
```

## 🔑 Credenciais

| Role | Email | Senha |
|------|-------|-------|
| Admin | admin@iscout.com | admin123 |
| Técnico | tecnico@iscout.com | tecnico123 |
| Olheiro | olheiro@iscout.com | olheiro123 |
| Responsável | responsavel@iscout.com | responsavel123 |

---

**Versão**: 2.0.0 | **Status**: ✅ Modernizado
