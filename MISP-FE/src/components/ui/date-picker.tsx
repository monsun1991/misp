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
}

export function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full h-8 text-xs justify-start text-left font-normal px-2 pr-6 truncate",
              "bg-[var(--background)] dark:bg-[var(--primaryCardLight)]",
              "border border-[var(--input-border,rgba(0,0,0,0.1))] dark:border-[var(--primaryBorder)]",
              "hover:bg-[var(--background)] dark:hover:bg-[var(--primaryCardLight)]",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format(parseISO(value), "MMM d, yyyy") : <span className="truncate">{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "w-auto p-0 rounded-xl overflow-hidden shadow-xl glass",
            "border border-[var(--input-border,rgba(0,0,0,0.1))] dark:border-[var(--primaryBorder)]",
            "bg-[var(--background)] dark:bg-[var(--primaryCard)] text-[var(--foreground)]"
          )} 
          align="start"
        >
          <Calendar
            mode="single"
            selected={value ? parseISO(value) : undefined}
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
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
