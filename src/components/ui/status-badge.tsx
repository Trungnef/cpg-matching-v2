import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export type StatusType =
  | "In Stock" 
  | "Low Stock" 
  | "Out of Stock" 
  | "active" 
  | "pending" 
  | "inactive"
  | "Active"
  | "Maintenance"
  | "Idle"
  | "Development"
  | "Inactive"
  | "Operational"
  | "In Production"
  | "Completed"
  | "Scheduled"
  | "Setup"
  | "Offline";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case "In Stock":
      case "active":
      case "Active":
      case "Operational":
      case "Completed":
        return isDark
          ? "bg-emerald-900/30 text-emerald-300 border-emerald-800/60 font-medium hover:bg-emerald-900/50"
          : "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium hover:bg-emerald-100";
      
      case "Low Stock":
      case "pending":
      case "Maintenance":
      case "Scheduled":
        return isDark
          ? "bg-amber-900/30 text-amber-300 border-amber-800/60 font-medium hover:bg-amber-900/50"
          : "bg-amber-50 text-amber-700 border-amber-200 font-medium hover:bg-amber-100";
      
      case "Out of Stock":
      case "inactive":
      case "Inactive":
      case "Idle":
      case "Offline":
        return isDark
          ? "bg-rose-900/30 text-rose-300 border-rose-800/60 font-medium hover:bg-rose-900/50"
          : "bg-rose-50 text-rose-700 border-rose-200 font-medium hover:bg-rose-100";
      
      case "Development":
      case "In Production":
      case "Setup":
        return isDark
          ? "bg-sky-900/30 text-sky-300 border-sky-800/60 font-medium hover:bg-sky-900/50"
          : "bg-sky-50 text-sky-700 border-sky-200 font-medium hover:bg-sky-100";
      
      default:
        return isDark
          ? "bg-slate-800/40 text-slate-300 border-slate-700/60 font-medium hover:bg-slate-800/60"
          : "bg-slate-100 text-slate-700 border-slate-200 font-medium hover:bg-slate-200";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "shadow-sm transition-colors duration-300",
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </Badge>
  );
}; 