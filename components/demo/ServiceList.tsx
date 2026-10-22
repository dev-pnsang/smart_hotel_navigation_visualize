"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { amenities, amenityFilters, getAmenity } from "@/data/demo-hotel/amenities";
import { getFloor } from "@/data/demo-hotel/floors";
import type { AmenityKind } from "@/data/demo-hotel/types";
import { useDemo } from "@/lib/demo-store";
import { Button } from "@/components/ui/Button";

export function ServiceList() {
  const router = useRouter();
  const { state, selectAmenity, selectFloor, startNavigation } = useDemo();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | AmenityKind>("all");

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    return amenities.filter((amenity) => {
      const matchesFilter = filter === "all" || amenity.kind === filter;
      const matchesQuery = !text || amenity.name.toLowerCase().includes(text) || amenity.summary.toLowerCase().includes(text);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="grid gap-4">
      <label className="flex min-h-12 items-center gap-2 border border-line bg-ivory px-3 text-sm">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm điểm đến"
          className="w-full bg-transparent outline-none"
        />
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {amenityFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`min-h-10 shrink-0 px-3 text-sm ${filter === item.id ? "bg-ink text-paper" : "border border-line bg-paper"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ul className="grid gap-3">
        {results.map((amenity) => {
          const active = state.selection?.kind === "amenity" && state.selection.id === amenity.id;
          const floor = getFloor(amenity.floorId);
          return (
            <li key={amenity.id} className={`border px-4 py-4 ${active ? "border-teal bg-paper" : "border-line bg-paper"}`}>
              <button
                type="button"
                className="w-full text-left"
                onClick={() => {
                  selectAmenity(amenity.id);
                  selectFloor(amenity.floorId);
                }}
              >
                <p className="font-display text-3xl leading-none">{amenity.name}</p>
                <p className="mt-2 text-xs tracking-[0.14em] text-muted uppercase">{floor?.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{amenity.summary}</p>
              </button>
              <div className="mt-3">
                <Button
                  variant="line"
                  onClick={() => {
                    const nodeId = getAmenity(amenity.id)?.nodeId;
                    if (!nodeId) return;
                    selectAmenity(amenity.id);
                    startNavigation(nodeId);
                    router.push("/stay/demo/navigate");
                  }}
                >
                  Dẫn đường
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      {results.length === 0 ? <p className="text-sm text-muted">Không có điểm đến khớp với tìm kiếm.</p> : null}
    </div>
  );
}
