import type { ColumnDef } from '@tanstack/react-table'
import {
  CircleXIcon,
  ListFilterIcon,
  PlusIcon,
  TriangleAlertIcon,
} from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { personTableColumns } from './person-table-column'

function getHeaderContent<T>(column: ColumnDef<T>) {
  const header = column.header
  if (typeof header === 'string') return header
  if (typeof header === 'function') return header({} as never)
  return header ?? null
}

type PersonTableErrorProps = {
  error: unknown
  retry?: () => void
}

export function PersonTableError({
  error,
  retry,
}: PersonTableErrorProps) {
  const errorMessage =
    error instanceof Error ? error.message : 'Erro desconhecido'

  function handleRetry() {
    retry?.()
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4">
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
                        <TriangleAlertIcon
                          aria-hidden
                          className="text-red-500"
                          size={24}
                        />
                      </EmptyMedia>
                      <EmptyTitle>
                        Erro ao carregar a tabela de pessoas
                      </EmptyTitle>
                      <EmptyDescription>{errorMessage}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button onClick={handleRetry}>Tentar novamente</Button>
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
