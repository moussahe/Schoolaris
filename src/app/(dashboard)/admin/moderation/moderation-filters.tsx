"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "all", label: "Tous", icon: Filter },
  { value: "PENDING_REVIEW", label: "En attente", icon: Clock },
  { value: "APPROVED", label: "Approuves", icon: CheckCircle },
  { value: "REJECTED", label: "Rejetes", icon: XCircle },
  { value: "CHANGES_REQUESTED", label: "Modifications", icon: AlertTriangle },
];

interface ModerationFiltersProps {
  currentStatus: string;
}

export function ModerationFilters({ currentStatus }: ModerationFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    router.push(`/admin/moderation?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((option) => {
        const Icon = option.icon;
        const isActive = currentStatus === option.value;

        return (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
