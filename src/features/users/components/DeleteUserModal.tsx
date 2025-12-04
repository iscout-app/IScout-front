import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useDeleteUserMutation } from '../hooks/useUsersQuery'
import type { User } from '../types/users.types'

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export function DeleteUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {
  const deleteMutation = useDeleteUserMutation()

  const handleDelete = async () => {
    if (!user) return

    try {
      await deleteMutation.mutateAsync(user.id)
      onClose()
    } catch (error) {
      // Error is handled by mutation
      console.error('Error deleting user:', error)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[1001]">
        <DialogHeader>
          <div className="flex items-center gap-12 mb-8">
            <div className="flex-shrink-0 w-48 h-48 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-24 w-24 text-destructive" />
            </div>
            <div className="flex-1">
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-16">
          <p className="text-sm text-muted-foreground">
            Você tem certeza que deseja excluir o usuário:
          </p>
          <div className="p-16 bg-muted rounded-lg">
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <p className="text-sm text-destructive font-medium">
            Todos os dados associados a este usuário serão removidos permanentemente.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-50"
            disabled={deleteMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="h-50"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir Usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
