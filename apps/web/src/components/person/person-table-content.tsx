import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  ListFilterIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { PersonTable } from "./person-table";
import { useState } from "react";
import { useFetchPersons } from "@/hooks/person/use-fetch-persons";
import { personTableColumns } from "./person-table-column";
import { Link, useParams } from "@tanstack/react-router";
import { DebouncedInputText } from "../debounced-input-text";

export function PersonTableContent() {
  const { slug } = useParams({ strict: false });

  const [filters, setFilters] = useState({
    search: "",
  });

  const query = useFetchPersons({ search: filters.search });

  const table = useReactTable({
    columns: personTableColumns,
    data: query.data?.persons || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  function handleClearFilter() {
    setFilters((prev) => ({
      ...prev,
      search: "",
    }));
  }

  function handleChangeFilter(search: string) {
    setFilters((prev) => ({
      ...prev,
      search,
    }));
  }

  const hasActiveFilter = filters.search.length > 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by deployments name */}
          <div className="relative">
            <DebouncedInputText
              aria-label="Pesquisar implementação..."
              className={cn("peer min-w-60 ps-9", hasActiveFilter && "pe-9")}
              id="deployments-table-input"
              name="search"
              placeholder="Pesquisar implementação..."
              type="text"
              value={filters.search}
              onChange={handleChangeFilter}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <ListFilterIcon aria-hidden="true" size={16} />
            </div>
            {hasActiveFilter && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleClearFilter}
                type="button"
              >
                <CircleXIcon aria-hidden="true" size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Add user button */}
          <Button asChild className="ml-auto">
            <Link to="/$slug/dashboard" params={{ slug: slug || "" }}>
              <PlusIcon
                aria-hidden="true"
                className="-ms-1 opacity-60"
                size={16}
              />
              Nova Implementação
            </Link>
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <PersonTable
          query={query}
          table={table}
          onClearFilter={handleClearFilter}
        />
      </div>
      {query.data?.persons.length && (
        <>
          {/* Pagination - separate block, always at bottom */}
          <div className="mt-auto flex shrink-0 items-center justify-between gap-8 px-4 py-3">
            {/* Results per page */}
            <div className="flex items-center gap-3">
              <span className="max-sm:sr-only">
                Total de {table.getRowCount()} item(s)
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Page number information */}
              <div className="flex grow justify-end whitespace-nowrap text-muted-foreground text-sm">
                <p
                  aria-live="polite"
                  className="whitespace-nowrap text-muted-foreground text-sm"
                >
                  <span className="text-foreground">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                  </span>
                </p>
              </div>

              <Pagination>
                <PaginationContent>
                  {/* First page button */}
                  <PaginationItem>
                    <Button
                      aria-label="Go to first page"
                      className="disabled:pointer-events-none disabled:opacity-50"
                      disabled={!table.getCanPreviousPage()}
                      onClick={() => table.firstPage()}
                      size="icon"
                      variant="outline"
                    >
                      <ChevronFirstIcon aria-hidden="true" size={16} />
                    </Button>
                  </PaginationItem>
                  {/* Previous page button */}
                  <PaginationItem>
                    <Button
                      aria-label="Go to previous page"
                      className="disabled:pointer-events-none disabled:opacity-50"
                      disabled={!table.getCanPreviousPage()}
                      onClick={() => table.previousPage()}
                      size="icon"
                      variant="outline"
                    >
                      <ChevronLeftIcon aria-hidden="true" size={16} />
                    </Button>
                  </PaginationItem>
                  {/* Next page button */}
                  <PaginationItem>
                    <Button
                      aria-label="Go to next page"
                      className="disabled:pointer-events-none disabled:opacity-50"
                      disabled={!table.getCanNextPage()}
                      onClick={() => table.nextPage()}
                      size="icon"
                      variant="outline"
                    >
                      <ChevronRightIcon aria-hidden="true" size={16} />
                    </Button>
                  </PaginationItem>
                  {/* Last page button */}
                  <PaginationItem>
                    <Button
                      aria-label="Go to last page"
                      className="disabled:pointer-events-none disabled:opacity-50"
                      disabled={!table.getCanNextPage()}
                      onClick={() => table.lastPage()}
                      size="icon"
                      variant="outline"
                    >
                      <ChevronLastIcon aria-hidden="true" size={16} />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </>
      )}
    </>
  );
}
