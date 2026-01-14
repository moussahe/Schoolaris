"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, BookOpen, User, Tag, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Suggestion {
  type: "course" | "subject" | "teacher";
  id: string;
  title: string;
  slug: string | null;
  image: string | null;
  meta: string;
  price: string | null;
}

interface SearchWithSuggestionsProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSearch?: (query: string) => void;
}

export function SearchWithSuggestions({
  placeholder = "Rechercher un cours, une matiere...",
  className,
  inputClassName,
  onSearch,
}: SearchWithSuggestionsProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setIsOpen(data.suggestions?.length > 0);
      setSelectedIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" && query) {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      router.push(`/courses?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setIsOpen(false);
    setQuery("");

    switch (suggestion.type) {
      case "course":
        router.push(`/courses/${suggestion.slug}`);
        break;
      case "teacher":
        router.push(`/teachers/${suggestion.slug}`);
        break;
      case "subject":
        router.push(`/courses?matiere=${suggestion.id}`);
        break;
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-4 w-4 text-emerald-500" />;
      case "teacher":
        return <User className="h-4 w-4 text-blue-500" />;
      case "subject":
        return <Tag className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className={cn(
            "h-10 w-full pl-10 pr-10 bg-muted focus:bg-background",
            inputClassName,
          )}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
          <ul className="py-1 max-h-[400px] overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li key={`${suggestion.type}-${suggestion.id}`}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    index === selectedIndex
                      ? "bg-emerald-50"
                      : "hover:bg-gray-50",
                  )}
                >
                  {/* Image or Icon */}
                  {suggestion.image ? (
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={suggestion.image}
                        alt={suggestion.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getIcon(suggestion.type)}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {suggestion.meta}
                    </p>
                  </div>

                  {/* Price for courses */}
                  {suggestion.price && (
                    <span
                      className={cn(
                        "text-sm font-medium flex-shrink-0",
                        suggestion.price === "Gratuit"
                          ? "text-emerald-600"
                          : "text-gray-900",
                      )}
                    >
                      {suggestion.price}
                    </span>
                  )}

                  {/* Type badge for non-courses */}
                  {suggestion.type !== "course" && (
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {suggestion.type === "teacher" ? "Prof" : "Matiere"}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* See all results */}
          {query.length >= 2 && (
            <div className="border-t px-4 py-2">
              <Link
                href={`/courses?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Voir tous les resultats pour &quot;{query}&quot;</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* No results state */}
      {isOpen &&
        query.length >= 2 &&
        suggestions.length === 0 &&
        !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border p-4 z-50">
            <p className="text-sm text-gray-500 text-center">
              Aucun resultat pour &quot;{query}&quot;
            </p>
            <Link
              href={`/courses?q=${encodeURIComponent(query)}`}
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Rechercher dans le catalogue</span>
            </Link>
          </div>
        )}
    </div>
  );
}
