"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "PENDING", label: "En attente" },
  { value: "UNDER_REVIEW", label: "En cours" },
  { value: "RESOLVED", label: "Resolus" },
  { value: "DISMISSED", label: "Rejetes" },
  { value: "ESCALATED", label: "Escalades" },
];

const typeOptions = [
  { value: "all", label: "Tous les types" },
  { value: "SAFETY_CONCERN", label: "Securite enfant" },
  { value: "INAPPROPRIATE_CONTENT", label: "Contenu inapproprie" },
  { value: "HARASSMENT", label: "Harcelement" },
  { value: "SPAM", label: "Spam" },
  { value: "MISINFORMATION", label: "Desinformation" },
  { value: "COPYRIGHT", label: "Droits d'auteur" },
  { value: "OTHER", label: "Autre" },
];

const priorityOptions = [
  { value: "all", label: "Toutes priorites" },
  { value: "HIGH", label: "Urgent" },
  { value: "MEDIUM", label: "Moyen" },
  { value: "LOW", label: "Faible" },
];

interface ReportsFiltersProps {
  currentStatus: string;
  currentType: string;
  currentPriority: string;
}

export function ReportsFilters({
  currentStatus,
  currentType,
  currentPriority,
}: ReportsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/admin/reports?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={currentStatus}
        onValueChange={(value) => updateFilter("status", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentType}
        onValueChange={(value) => updateFilter("type", value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentPriority}
        onValueChange={(value) => updateFilter("priority", value)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Priorite" />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
