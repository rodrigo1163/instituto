import type { ColumnDef, Row } from '@tanstack/react-table'
import { EllipsisIcon } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fDateTime } from '@/utils/format-time'
import type { Person } from '@/api/fetch-persons'

function RowActions({ row }: { row: Row<Person> }) {
  const { slug } = useParams({ strict: false })
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            aria-label="Edit item"
            className="shadow-none"
            size="icon"
            variant="ghost"
          >
            <EllipsisIcon aria-hidden="true" size={16} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/$slug/dashboard" params={{ slug: slug! }}>
              Visualizar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Editar</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Apagar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const personTableColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'id',
    cell: ({ row }) => (
      <div className="font-mono text-muted-foreground text-sm truncate">
        {row.getValue('id')}
      </div>
    ),
    header: 'ID',
    size: 180,
  },
  {
    accessorKey: 'fullName',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('fullName')}</div>
    ),
    header: 'Nome',
    size: 220,
  },
  {
    accessorKey: 'cpf',
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.getValue('cpf')}
      </div>
    ),
    header: 'CPF',
    size: 140,
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {fDateTime(row.getValue('createdAt'), 'dd/MM/yyyy HH:mm') ?? '-'}
      </div>
    ),
    header: 'Data de criação',
    size: 160,
  },
  {
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    id: 'actions',
    size: 60,
  },
]
