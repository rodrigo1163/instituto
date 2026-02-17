import type { FetchPersonsResponse, Person } from "@/api/fetch-persons";
import { PersonTableSkeleton } from "./person-table-skeleton";
import { PersonTableError } from "./person-table-error";
import type { UseQueryResult } from "@tanstack/react-query";
import { PersonTableEmpty } from "./person-table-empty";
import { flexRender, type Table as TableType } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface PersonTableProps {
  query: UseQueryResult<FetchPersonsResponse, Error>;
  table: TableType<Person>;
  onClearFilter: () => void;
}

export function PersonTable({ query: { data, isLoading, error, refetch }, table, onClearFilter }: PersonTableProps) {
  const tableRows = table.getRowModel().rows;
  const hasActiveFilter = Boolean(table.getState().columnFilters.length > 0);

  if (isLoading) {
    return <PersonTableSkeleton />;
  }

  if (error) {
    return <PersonTableError error={error} retry={refetch} />;
  }

  if (data?.persons.length === 0 || tableRows.length === 0) {
    return (
      <PersonTableEmpty
        hasActiveFilter={hasActiveFilter}
        onClearFilter={onClearFilter}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-15rem)] flex-col gap-4">
      <div className="overflow-hidden rounded-md border bg-background">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="h-11"
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          className={cn(
                            "w-full text-left",
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          type="button"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                aria-hidden="true"
                                className="shrink-0 opacity-60"
                                size={16}
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="shrink-0 opacity-60"
                                size={16}
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tableRows &&
              tableRows.length > 0 &&
              tableRows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="last:py-0" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
