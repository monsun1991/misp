import { useState } from "react"
import { format, parseISO } from "date-fns"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  let displayLabel: React.ReactNode = <span className="truncate">{placeholder}</span>;
  let parsedDate: Date | undefined;
  if (value) {
    try {
      const d = parseISO(value);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
        displayLabel = format(d, "MMM d, yyyy");
      }
    } catch {
      displayLabel = value;
    }
  }

  return (
    <div className={cn("relative", className || "w-full")}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full h-8 text-xs justify-start text-left font-normal px-2.5 pr-6 truncate",
              "bg-[var(--background)] dark:bg-[var(--primaryCardLight)]",
              "border border-[var(--input-border,rgba(0,0,0,0.1))] dark:border-[var(--primaryBorder)]",
              "hover:bg-[var(--background)] dark:hover:bg-[var(--primaryCardLight)]",
              !value && "text-muted-foreground"
            )}
          >
            {displayLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "w-auto p-0 rounded-xl overflow-hidden shadow-xl glass z-50",
            "border border-[var(--input-border,rgba(0,0,0,0.1))] dark:border-[var(--primaryBorder)]",
            "bg-white dark:bg-slate-900 text-[var(--foreground)]"
          )} 
          align="start"
        >
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={(date) => {
              onChange(date ? format(date, "yyyy-MM-dd") : "");
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
