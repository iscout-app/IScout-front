import { Navigation } from './Navigation'
import { UserInfo } from './UserInfo'
import { TeamSelector } from '@/features/teams/components/TeamSelector'

export function Header() {
  return (
    <header className="border-b-2 border-border bg-gradient-to-r from-teal-500/3 to-primary/3 p-5 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-center justify-between gap-8">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal-700 text-2xl shadow-md shadow-primary/30 transition-transform hover:scale-105">
              ⚽
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">IScout</h1>
          </div>

          {/* Navigation */}
          <Navigation />

          {/* Team Selector */}
          <TeamSelector />

          {/* User Info */}
          <UserInfo />
        </div>
      </div>
    </header>
  )
}
