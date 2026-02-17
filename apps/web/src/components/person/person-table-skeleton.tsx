import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ROWS = 10
const COLUMNS = [
  { width: 120 }, // ID
  { width: 220 }, // Nome
  { width: 160 }, // Data de criação
  { width: 60 }, // Actions
]

export function PersonTableSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col gap-4">
      {/* Table - grows to fill space */}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="overflow-hidden rounded-md border bg-background">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {COLUMNS.map((col, i) => (
                  <TableHead
                    className="h-11"
                    key={i}
                    style={{ width: `${col.width}px` }}
                  >
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: ROWS }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {COLUMNS.map((_, colIndex) => (
                    <TableCell className="last:py-0" key={colIndex}>
                      <Skeleton
                        className={colIndex === 1 ? 'h-4 w-32' : 'h-4 w-20'}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination - separate block, always at bottom */}
      <div className="mt-auto flex shrink-0 items-center justify-between gap-8 px-4 py-3">
        <Skeleton className="h-4 w-28" />
        <div className="flex grow justify-end gap-2">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}
