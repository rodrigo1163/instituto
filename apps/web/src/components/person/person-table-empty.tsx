import type { ColumnDef } from '@tanstack/react-table'
import { CircleXIcon, FolderOpenIcon, PlusIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { personTableColumns } from './person-table-column'

function getHeaderContent<T>(column: ColumnDef<T>) {
  const header = column.header
  if (typeof header === 'string') return header
  if (typeof header === 'function') return header({} as never)
  return header ?? null
}

type PersonTableEmptyProps = {
  hasActiveFilter?: boolean
  onClearFilter?: () => void
  filterValue?: string
}

export function PersonTableEmpty({
  hasActiveFilter = false,
  onClearFilter,
  filterValue: controlledFilterValue,
}: PersonTableEmptyProps) {
  const { slug } = useParams({ strict: false }) as { slug?: string }
  const [localFilterValue, setLocalFilterValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = controlledFilterValue !== undefined
  const hasFilter = isControlled ? hasActiveFilter : localFilterValue.length > 0

  function handleClearFilter() {
    if (!isControlled) setLocalFilterValue('')
    onClearFilter?.()
    inputRef.current?.focus()
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col gap-4">
      {/* Table - grows to fill space */}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="overflow-hidden rounded-md border bg-background">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {personTableColumns.map((column, index) => (
                  <TableHead
                    className="h-11"
                    key={'id' in column ? column.id : index}
                    style={{
                      width:
                        'size' in column && column.size
                          ? `${column.size}px`
                          : undefined,
                    }}
                  >
                    {getHeaderContent(column)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  className="h-24"
                  colSpan={personTableColumns.length}
                >
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FolderOpenIcon aria-hidden size={24} />
                      </EmptyMedia>
                      <EmptyTitle>Nenhuma pessoa encontrada</EmptyTitle>
                      <EmptyDescription>
                        Adicione uma pessoa para gerenciar informações e visualizar os dados aqui.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <div className="flex gap-2">
                        {hasFilter && onClearFilter && (
                          <Button onClick={handleClearFilter}>
                            <CircleXIcon size={16} /> Limpar filtro
                          </Button>
                        )}
                        <Button asChild>
                          <Link to="/$slug/dashboard" params={{ slug: slug || '' }}>
                            <PlusIcon size={16} /> Adicionar pessoa
                          </Link>
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
