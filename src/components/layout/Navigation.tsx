import { Link, useLocation } from 'react-router-dom'
import { Permission } from '@/types/permissions.types'
import { usePermission } from '@/lib/rbac/hooks'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  permission: Permission | null
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', permission: null },
  { label: 'Jogadores', href: '/players', permission: 'VISUALIZAR_JOGADORES' },
  { label: 'Cadastrar', href: '/players/new', permission: 'CADASTRAR_JOGADOR' },
  { label: 'Estatísticas', href: '/statistics', permission: 'REGISTRAR_ESTATISTICA' },
  { label: 'Histórico', href: '/history', permission: 'VISUALIZAR_HISTORICO' },
  { label: 'Evolução', href: '/evolution', permission: 'VISUALIZAR_EVOLUCAO' },
  { label: 'Relatórios', href: '/reports', permission: 'RELATORIOS_INDIVIDUAIS' },
  { label: 'Usuários', href: '/users', permission: 'CADASTRAR_USUARIO' },
]

function NavLink({ item }: { item: NavItem }) {
  const location = useLocation()
  const isActive = location.pathname === item.href

  return (
    <Link
      to={item.href}
      className={cn(
        'rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-all duration-fast',
        'hover:border-primary/15 hover:bg-primary/8',
        isActive && 'border-primary/25 bg-primary/12 font-semibold text-primary'
      )}
    >
      {item.label}
    </Link>
  )
}

export function Navigation() {
  const visibleItems = NAV_ITEMS.filter((item) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (item.permission === null) return true
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return usePermission(item.permission)
  })

  return (
    <nav className="flex flex-wrap gap-1">
      {visibleItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  )
}
