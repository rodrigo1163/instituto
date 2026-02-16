import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Category = z.union([
  z.literal("electronics"),
  z.literal("clothing"),
  z.literal("books"),
  z.literal("toys"),
]);

const ItemFilters = z.object({
  query: z.string().optional(),
  hasDiscount: z.boolean().optional(),
  categories: z.array(Category).optional(),
});

type ItemFilters = z.infer<typeof ItemFilters>;

export const Route = createFileRoute("/(private)/search")({
  validateSearch: (search) => ItemFilters.parse(search),
  component: Search,
});

function Search() {
  const { query, hasDiscount, categories } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const updateFilters = (name: keyof ItemFilters, value: unknown) => {
    navigate({ search: (prev) => ({ ...prev, [name]: value }) });
  };

  return (
    <div>
      <h2>Search</h2>
      You searched for:{" "}
      <input
        value={query}
        onChange={(e) => {
          updateFilters("query", e.target.value);
        }}
      />
      <input
        type="checkbox"
        checked={hasDiscount}
        onChange={(e) => updateFilters("hasDiscount", e.target.checked)}
      />
      <select
        multiple
        onChange={(e) => {
          updateFilters(
            "categories",
            Array.from(e.target.selectedOptions, (option) => option.value)
          );
        }}
        value={categories}
      >
        {["electronics", "clothing", "books", "toys"].map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <pre>{JSON.stringify({ query, hasDiscount, categories }, null, 2)}</pre>
    </div>
  );
}
