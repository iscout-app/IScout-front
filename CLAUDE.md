# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IScout is a React-based web application for scouting and managing sports team statistics. The application provides comprehensive player management, statistics tracking, performance analysis, and reporting capabilities.

## Development Commands

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run typecheck

# Linting
bun run lint
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query) for server state
- **Form Management**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast

## Project Structure

```
src/
├── app/                    # Application core
│   ├── router.tsx         # Route definitions with lazy loading
│   └── providers/         # Context providers
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # Layout components (Header, Navigation, UserInfo)
│   └── shared/           # Shared business components
├── features/             # Feature modules (domain-driven)
│   ├── auth/            # Authentication & authorization
│   ├── dashboard/       # Dashboard page
│   ├── players/         # Player management
│   │   ├── api/        # API client methods
│   │   ├── components/ # Feature-specific components
│   │   ├── hooks/      # React Query hooks
│   │   ├── pages/      # Page components
│   │   └── types/      # TypeScript types
│   ├── statistics/      # Statistics entry and management
│   ├── history/         # Historical data views
│   ├── evolution/       # Player evolution tracking
│   ├── reports/         # Report generation
│   └── users/           # User management
├── lib/                 # Shared utilities
│   ├── api/            # API client configuration
│   ├── rbac/           # Role-based access control
│   └── utils.ts        # Utility functions
├── types/              # Global TypeScript types
└── styles/             # Global styles
```

## UI Standards

### Height Standards for Form Elements

**IMPORTANT**: All form inputs, selects, and buttons MUST have a minimum height for consistency and usability:

- **Inputs**: Use `h-100` class or equivalent (40-44px)
- **Select dropdowns**: Use `h-100` class or equivalent (40-44px)
- **Buttons**: Use `h-50` class minimum for action buttons (48-52px)
- **Text areas**: Minimum 4 rows (`rows={4}`)

Example:
```tsx
<Input className="h-100" />
<Select><SelectTrigger className="h-100" /></Select>
<Button className="h-50">Submit</Button>
```

### Spacing System

The project uses a custom spacing scale (8px base unit):
- `gap-8`, `space-y-8`: 8px
- `gap-12`: 12px
- `gap-16`, `space-y-16`: 16px
- `gap-24`, `space-y-24`: 24px
- `p-24`: 24px padding

### Design Tokens

Colors follow the shadcn/ui theming system:
- `primary`: Main brand color (teal/green)
- `secondary`: Secondary accent
- `muted`: Muted backgrounds
- `destructive`: Error/delete actions
- `border`: Border colors

## Feature Module Pattern

Each feature follows a consistent structure:

```
features/{feature-name}/
├── api/              # API integration
│   └── {feature}.api.ts
├── components/       # Feature-specific components
├── hooks/           # React Query hooks
│   └── use{Feature}Query.ts
├── pages/           # Page components
├── types/           # TypeScript interfaces
│   └── {feature}.types.ts
└── {FeatureName}.tsx  # Main feature component
```

## API Integration

### API Client Setup

Located in `src/lib/api/client.ts`:
- Axios instance with base URL configuration
- Request/response interceptors for auth tokens
- Automatic error handling

### Creating API Methods

```typescript
// features/{feature}/api/{feature}.api.ts
import { apiClient } from '@/lib/api/client'
import type { FeatureType } from '../types/{feature}.types'

export const featureApi = {
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: FeatureType[] }>('/endpoint')
    return response.data.data
  },

  create: async (data: CreateFeatureDto) => {
    const response = await apiClient.post<{ success: boolean; data: FeatureType }>('/endpoint', data)
    return response.data.data
  },
}
```

### React Query Hooks

```typescript
// features/{feature}/hooks/use{Feature}Query.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { featureApi } from '../api/{feature}.api'
import toast from 'react-hot-toast'

export const FEATURE_QUERY_KEY = ['feature'] as const

export function useFeatureQuery() {
  return useQuery({
    queryKey: FEATURE_QUERY_KEY,
    queryFn: () => featureApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateFeatureMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFeatureDto) => featureApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_QUERY_KEY })
      toast.success('Success message')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error message')
    },
  })
}
```

## Form Management

### React Hook Form + Zod Pattern

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.coerce.number().int().min(0),
})

type FormData = z.infer<typeof formSchema>

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    // Handle submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} className="h-100" />
      {errors.name && <p className="text-destructive">{errors.name.message}</p>}
    </form>
  )
}
```

## Authentication & Authorization

### RBAC System

Located in `src/lib/rbac/`:
- Permission-based access control
- Hook: `usePermission(permission: Permission)`
- Component: `<RequirePermission permission="PERMISSION_NAME">`

### Available Permissions

Defined in `src/types/permissions.types.ts`:
- `VISUALIZAR_JOGADORES`: View players
- `CADASTRAR_JOGADOR`: Register/edit players
- `REGISTRAR_ESTATISTICA`: Record statistics
- `VISUALIZAR_HISTORICO`: View history
- `VISUALIZAR_EVOLUCAO`: View evolution
- `RELATORIOS_INDIVIDUAIS`: Individual reports
- `CADASTRAR_USUARIO`: Manage users

## Routing

Routes are defined in `src/app/router.tsx` using React Router v6:
- Lazy loading for code splitting
- Protected routes with `<ProtectedRoute>`
- Permission-based route access with `<RequirePermission>`

## Component Patterns

### Modal Pattern

Use modals for create/edit operations:

```tsx
<PlayerFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  playerId={editingPlayerId} // undefined for create, string for edit
/>
```

### Card Layout Pattern

Use shadcn/ui Card components for content sections:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Best Practices

1. **Always use TypeScript**: Define proper types/interfaces
2. **Validate forms with Zod**: Server-side validation mirrors backend
3. **Use React Query for server state**: Never use useState for API data
4. **Follow the feature module pattern**: Keep related code together
5. **Apply consistent heights**: All form fields use `h-100` minimum
6. **Handle loading states**: Show skeleton loaders or spinners
7. **Show user feedback**: Use toast notifications for actions
8. **Implement error boundaries**: Graceful error handling
9. **Lazy load routes**: Improve initial load time
10. **Use permissions**: Protect sensitive features and routes

## Common Issues

### SelectTrigger Height

Always apply height class to SelectTrigger, not Select:

```tsx
<Select>
  <SelectTrigger className="h-100"> {/* ✅ Correct */}
    <SelectValue />
  </SelectTrigger>
</Select>
```

### Z-Index for Modals

Modals and their dropdowns need proper z-index stacking:

```tsx
<div className="fixed inset-0 z-[1000]"> {/* Modal backdrop */}
  <div className="z-[1001]"> {/* Modal content */}
    <SelectContent className="z-[1100]"> {/* Dropdown inside modal */}
```

## Adding New Features

1. Create feature directory in `src/features/{feature-name}/`
2. Define TypeScript types in `types/`
3. Create API client in `api/`
4. Create React Query hooks in `hooks/`
5. Build UI components in `components/` or pages in `pages/`
6. Add routes in `src/app/router.tsx`
7. Add navigation link in `src/components/layout/Navigation.tsx` (if needed)
8. Implement permission checks using RBAC system
