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

interface CoursesFiltersProps {
  currentStatus: string;
  currentSubject: string;
  currentSearch: string;
}

const SUBJECTS = [
  { value: "MATHEMATIQUES", label: "Mathematiques" },
  { value: "FRANCAIS", label: "Francais" },
  { value: "HISTOIRE_GEO", label: "Histoire-Geo" },
  { value: "SCIENCES", label: "Sciences" },
  { value: "ANGLAIS", label: "Anglais" },
  { value: "PHYSIQUE_CHIMIE", label: "Physique-Chimie" },
  { value: "SVT", label: "SVT" },
  { value: "PHILOSOPHIE", label: "Philosophie" },
  { value: "ESPAGNOL", label: "Espagnol" },
  { value: "ALLEMAND", label: "Allemand" },
  { value: "SES", label: "SES" },
  { value: "NSI", label: "NSI" },
];

export function CoursesFilters({
  currentStatus,
  currentSubject,
  currentSearch,
}: CoursesFiltersProps) {
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
      params.delete("page");
      router.push(`/admin/courses?${params.toString()}`);
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
    router.push("/admin/courses");
  }, [router]);

  const hasFilters =
    currentStatus !== "all" || currentSubject !== "all" || currentSearch;

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-card sm:flex-row sm:items-center">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre ou auteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </form>

      {/* Status Filter */}
      <Select
        value={currentStatus}
        onValueChange={(v) => updateFilters("status", v)}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="published">Publies</SelectItem>
          <SelectItem value="draft">Brouillons</SelectItem>
        </SelectContent>
      </Select>

      {/* Subject Filter */}
      <Select
        value={currentSubject}
        onValueChange={(v) => updateFilters("subject", v)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Matiere" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes matieres</SelectItem>
          {SUBJECTS.map((subject) => (
            <SelectItem key={subject.value} value={subject.value}>
              {subject.label}
            </SelectItem>
          ))}
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
