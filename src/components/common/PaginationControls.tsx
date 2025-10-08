import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationControlsProps {
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    has_next: boolean;
    has_prev: boolean;
  };
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 25, label: "25 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" },
];

export const PaginationControls = ({
  pagination,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) => {
  const startItem = ((pagination.current_page - 1) * pageSize) + 1;
  const endItem = Math.min(pagination.current_page * pageSize, pagination.total_items);

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center space-x-4">
        <p className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {pagination.total_items}
        </p>
        
        {onPageSizeChange && (
          <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(parseInt(val))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!pagination.has_prev}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={!pagination.has_prev}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center px-3">
          <span className="text-sm font-medium">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={!pagination.has_next}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.total_pages)}
          disabled={!pagination.has_next}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};