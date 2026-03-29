import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

const numberFormatter = new Intl.NumberFormat("ru-RU");
const compactFormatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1
});

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatPercent(value) {
  return isFiniteNumber(value) ? `${value.toFixed(1)}%` : "N/A";
}

function formatThousands(value) {
  return isFiniteNumber(value) ? `${value.toFixed(1)}k` : "N/A";
}

function formatPopulation(value) {
  return isFiniteNumber(value) ? compactFormatter.format(value) : "N/A";
}

function formatInteger(value) {
  return isFiniteNumber(value) ? numberFormatter.format(Math.round(value)) : "N/A";
}

function SortIcon({ direction }) {
  if (direction === "asc") {
    return <ArrowUp size={14} className="text-slate-400" />;
  }

  if (direction === "desc") {
    return <ArrowDown size={14} className="text-slate-400" />;
  }

  return <ArrowUpDown size={14} className="text-slate-600" />;
}

export default function RegionsTable({ regions, selectedRegion, onSelectRegion }) {
  const [sorting, setSorting] = useState([{ id: "unemploymentRate", desc: true }]);
  const [query, setQuery] = useState("");

  const filteredRegions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return regions;
    }

    return regions.filter((row) => row.region.toLowerCase().includes(normalized));
  }, [query, regions]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "region",
        header: "Region",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-100">{row.original.region}</p>
            <p className="mt-1 text-xs text-slate-500">
              Natural growth: {numberFormatter.format(Math.round(row.original.naturalGrowth ?? 0))}
            </p>
          </div>
        )
      },
      {
        accessorKey: "unemploymentRate",
        header: "Unemployment",
        cell: ({ getValue }) => <span className="font-mono text-amber-200">{formatPercent(getValue())}</span>
      },
      {
        accessorKey: "employmentRate",
        header: "Employment",
        cell: ({ getValue }) => <span className="font-mono text-cyan-200">{formatPercent(getValue())}</span>
      },
      {
        accessorKey: "unemploymentCount",
        header: "Unemployed",
        cell: ({ getValue }) => <span className="font-mono text-slate-300">{formatThousands(getValue())}</span>
      },
      {
        accessorKey: "migrationBalance",
        header: "Migration",
        cell: ({ getValue }) => <span className="font-mono text-slate-300">{formatInteger(getValue())}</span>
      },
      {
        accessorKey: "population2026",
        header: "Population",
        cell: ({ getValue }) => <span className="font-mono text-slate-300">{formatPopulation(getValue())}</span>
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredRegions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <motion.section
      className="surface p-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut", delay: 0.08 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="data-kicker">Ranking workspace</p>
          <h2 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-white">Regional comparison table</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Dense rows, soft motion, instant ranking changes. This table is designed to feel like a premium operational console.
          </p>
        </div>

        <label className="table-search relative w-full max-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search region"
            className="h-11 w-full rounded-[12px] border border-white/10 bg-white/[0.03] pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/35"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <motion.div
          key={selectedRegion}
          className="table-summary-chip"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          Selected region: {selectedRegion}
        </motion.div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="table-summary-chip">{filteredRegions.length} rows</span>
          <span className="table-summary-chip">
            Sorted by {sorting[0]?.id ? sorting[0].id.replace(/([A-Z])/g, " $1").toLowerCase() : "region"}
          </span>
        </div>
      </div>

      <div className="table-shell mt-4">
        <div className="table-scroll overflow-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-white/[0.02]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-white/8 px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 transition hover:text-slate-200"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          <SortIcon direction={header.column.getIsSorted()} />
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row, index) => {
                const isSelected = row.original.region === selectedRegion;

                return (
                  <motion.tr
                    key={row.id}
                    className={`table-row cursor-pointer border-b border-white/6 transition ${
                      isSelected ? "table-row--selected" : ""
                    } ${
                      isSelected ? "bg-cyan-400/[0.08]" : "hover:bg-white/[0.035]"
                    }`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.02 }}
                    whileHover={{ x: 1.5 }}
                    onClick={() => onSelectRegion(row.original.region)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-slate-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
