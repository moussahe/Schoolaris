"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UsersFiltersProps {
  currentRole: string;
  currentSearch: string;
}

export function UsersFilters({
  currentRole,
  currentSearch,
}: UsersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filtering
      params.delete("page");
      router.push(`/admin/users?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateFilters("search", search);
    },
    [search, updateFilters],
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    router.push("/admin/users");
  }, [router]);

  const hasFilters = currentRole !== "all" || currentSearch;

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-card sm:flex-row sm:items-center">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </form>

      {/* Role Filter */}
      <Select
        value={currentRole}
        onValueChange={(v) => updateFilters("role", v)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Filtrer par role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les roles</SelectItem>
          <SelectItem value="PARENT">Parents</SelectItem>
          <SelectItem value="TEACHER">Enseignants</SelectItem>
          <SelectItem value="ADMIN">Administrateurs</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-4 w-4" />
          Effacer
        </Button>
      )}
    </div>
  );
}
