"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Calculator,
  Globe,
  Microscope,
  History,
  Languages,
  Atom,
  Beaker,
  Leaf,
  BookMarked,
  User,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandLoading,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface SearchResult {
  id: string;
  title: string;
  type: "course" | "teacher" | "subject";
  description?: string;
  image?: string;
  subject?: string;
  level?: string;
  price?: number;
  isFree?: boolean;
  rating?: number;
  studentCount?: number;
  slug?: string;
}

interface SearchCommandProps {
  placeholder?: string;
}

// Subject icons mapping
const subjectIcons: Record<string, React.ElementType> = {
  MATHEMATIQUES: Calculator,
  FRANCAIS: BookMarked,
  HISTOIRE: History,
  GEOGRAPHIE: Globe,
  SCIENCES: Microscope,
  ANGLAIS: Languages,
  PHYSIQUE: Atom,
  CHIMIE: Beaker,
  SVT: Leaf,
  PHILOSOPHIE: BookOpen,
};

// Subject colors mapping
const subjectColors: Record<string, string> = {
  MATHEMATIQUES: "bg-math text-white",
  FRANCAIS: "bg-french text-white",
  HISTOIRE: "bg-history text-white",
  GEOGRAPHIE: "bg-geography text-white",
  SCIENCES: "bg-science text-white",
  ANGLAIS: "bg-english text-white",
  PHYSIQUE: "bg-physics text-white",
  CHIMIE: "bg-chemistry text-white",
  SVT: "bg-svt text-white",
  PHILOSOPHIE: "bg-philosophy text-white",
};

// Quick filters
const quickFilters = [
  { id: "popular", label: "Populaires", icon: TrendingUp },
  { id: "new", label: "Nouveautes", icon: Sparkles },
  { id: "free", label: "Gratuits", icon: Star },
];

// Levels
const levels = [
  { id: "CP", label: "CP" },
  { id: "CE1", label: "CE1" },
  { id: "CE2", label: "CE2" },
  { id: "CM1", label: "CM1" },
  { id: "CM2", label: "CM2" },
  { id: "SIXIEME", label: "6eme" },
  { id: "CINQUIEME", label: "5eme" },
  { id: "QUATRIEME", label: "4eme" },
  { id: "TROISIEME", label: "3eme" },
  { id: "SECONDE", label: "2nde" },
  { id: "PREMIERE", label: "1ere" },
  { id: "TERMINALE", label: "Terminale" },
];

export function SearchCommand({
  placeholder = "Rechercher un cours, une matiere...",
}: SearchCommandProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // Keyboard shortcut to open search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Load recent searches from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const updated = [
      result.title,
      ...recentSearches.filter((s) => s !== result.title),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate
    if (result.type === "course" && result.slug) {
      router.push(`/courses/${result.slug}`);
    } else if (result.type === "teacher" && result.slug) {
      router.push(`/teachers/${result.slug}`);
    } else if (result.type === "subject") {
      router.push(`/courses?subject=${result.id}`);
    }

    setOpen(false);
    setQuery("");
  };

  // Handle quick filter selection
  const handleQuickFilter = (filterId: string) => {
    router.push(`/courses?filter=${filterId}`);
    setOpen(false);
  };

  // Handle level selection
  const handleLevelSelect = (levelId: string) => {
    router.push(`/courses?level=${levelId}`);
    setOpen(false);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-2.5",
          "text-sm text-muted-foreground transition-all duration-200",
          "hover:border-primary/50 hover:bg-muted/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "w-full max-w-md",
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{placeholder}</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && (
            <CommandLoading>
              <div className="flex items-center justify-center gap-2 py-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </motion.div>
                <span className="text-sm text-muted-foreground">
                  Recherche en cours...
                </span>
              </div>
            </CommandLoading>
          )}

          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <Search className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Aucun resultat trouve
              </p>
              <p className="text-xs text-muted-foreground/70">
                Essayez avec d&apos;autres mots-cles
              </p>
            </div>
          </CommandEmpty>

          {/* Search Results */}
          <AnimatePresence mode="wait">
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CommandGroup heading="Resultats">
                  {results.map((result, index) => {
                    const Icon = result.subject
                      ? subjectIcons[result.subject] || BookOpen
                      : User;
                    const colorClass = result.subject
                      ? subjectColors[result.subject]
                      : "bg-primary text-primary-foreground";

                    return (
                      <CommandItem
                        key={result.id}
                        value={result.title}
                        onSelect={() => handleSelect(result)}
                        className="group"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 w-full"
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                              colorClass,
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {result.title}
                            </p>
                            {result.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </p>
                            )}
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-2 shrink-0">
                            {result.level && (
                              <Badge variant="secondary" className="text-xs">
                                {result.level}
                              </Badge>
                            )}
                            {result.isFree ? (
                              <Badge
                                variant="default"
                                className="bg-secondary-500 text-xs"
                              >
                                Gratuit
                              </Badge>
                            ) : result.price ? (
                              <span className="text-sm font-semibold">
                                {result.price} EUR
                              </span>
                            ) : null}
                            {result.rating && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {result.rating.toFixed(1)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Filters - Show when no query */}
          {!query && (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <CommandGroup heading="Recherches recentes">
                  {recentSearches.map((search, index) => (
                    <CommandItem
                      key={`recent-${index}`}
                      value={search}
                      onSelect={() => setQuery(search)}
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandSeparator />

              {/* Quick Filters */}
              <CommandGroup heading="Filtres rapides">
                {quickFilters.map((filter) => (
                  <CommandItem
                    key={filter.id}
                    value={filter.label}
                    onSelect={() => handleQuickFilter(filter.id)}
                  >
                    <filter.icon className="mr-2 h-4 w-4" />
                    <span>{filter.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              {/* Browse by Subject */}
              <CommandGroup heading="Par matiere">
                <div className="grid grid-cols-2 gap-1 p-1">
                  {Object.entries(subjectIcons).map(([subject, Icon]) => (
                    <CommandItem
                      key={subject}
                      value={subject}
                      onSelect={() =>
                        handleSelect({
                          id: subject,
                          title: subject,
                          type: "subject",
                        })
                      }
                      className="flex items-center gap-2"
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md",
                          subjectColors[subject],
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm capitalize">
                        {subject.toLowerCase().replace("_", " ")}
                      </span>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>

              <CommandSeparator />

              {/* Browse by Level */}
              <CommandGroup heading="Par niveau">
                <div className="flex flex-wrap gap-1 p-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => handleLevelSelect(level.id)}
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        "bg-muted hover:bg-muted/80 transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

// Compact search trigger for header
export function SearchTrigger({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center justify-center rounded-lg p-2",
          "text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          className,
        )}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Rechercher</span>
      </button>

      {/* Reuse the same dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <SearchCommandContent />
      </CommandDialog>
    </>
  );
}

// Internal search content component
function SearchCommandContent() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <CommandInput
        placeholder="Rechercher un cours, une matiere..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && (
          <CommandLoading>
            <div className="flex items-center justify-center gap-2 py-6">
              <Search className="h-4 w-4 animate-pulse text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Recherche...
              </span>
            </div>
          </CommandLoading>
        )}

        <CommandEmpty>
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">Aucun resultat</p>
          </div>
        </CommandEmpty>

        {results.length > 0 && (
          <CommandGroup heading="Resultats">
            {results.map((result) => (
              <CommandItem
                key={result.id}
                value={result.title}
                onSelect={() => {
                  if (result.slug) {
                    router.push(`/courses/${result.slug}`);
                  }
                }}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>{result.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!query && (
          <>
            <CommandGroup heading="Suggestions">
              <CommandItem
                value="cours-populaires"
                onSelect={() => router.push("/courses?filter=popular")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Cours populaires</span>
              </CommandItem>
              <CommandItem
                value="cours-gratuits"
                onSelect={() => router.push("/courses?filter=free")}
              >
                <Star className="mr-2 h-4 w-4" />
                <span>Cours gratuits</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Matieres">
              {Object.entries(subjectIcons)
                .slice(0, 5)
                .map(([subject, Icon]) => (
                  <CommandItem
                    key={subject}
                    value={subject}
                    onSelect={() => router.push(`/courses?subject=${subject}`)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="capitalize">{subject.toLowerCase()}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </>
  );
}
