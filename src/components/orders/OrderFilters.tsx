import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterBar } from "@/components/common/FilterBar";
import { OrderFilters as Filters } from "@/types/order";

interface OrderFiltersProps {
  filters: Filters;
  updateFilter: (key: keyof Filters, value: string) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
  onApply: () => void;
}

export const OrderFilters = ({
  filters,
  updateFilter,
  clearFilters,
  activeFiltersCount,
  onApply,
}: OrderFiltersProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select 
        value={filters.status} 
        onValueChange={(value) => updateFilter('status', value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="preparing">Preparing</SelectItem>
          <SelectItem value="assigning">Accepted</SelectItem>
          <SelectItem value="assigned">Assigned</SelectItem>
          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <FilterBar 
        activeFiltersCount={activeFiltersCount} 
        onClear={clearFilters}
      >
        {/* Add more filter controls here as needed */}
        <p className="text-sm text-muted-foreground">More filters coming soon</p>
      </FilterBar>
    </div>
  );
};