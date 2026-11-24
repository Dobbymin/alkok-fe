import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { cn } from "@alkok/core";

export const Table = ({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) => (
  <div className="relative w-full overflow-x-auto rounded-lg border border-border bg-card">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
);

export const TableHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("border-b border-border bg-muted/50", className)} {...props} />
);

export const TableBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

export const TableRow = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/40",
      className,
    )}
    {...props}
  />
);

export const TableHead = ({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "h-10 px-3 text-left align-middle text-xs font-semibold text-muted-foreground",
      className,
    )}
    {...props}
  />
);

export const TableCell = ({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-3 py-2.5 align-middle", className)} {...props} />
);
