import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/common/DataTable";
import { Eye, Package } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/utils/formatters";
import { Order } from "@/types/order";
import { parseISO } from "date-fns";

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  isLoading: boolean;
}

export const OrdersTable = ({ orders, onViewOrder, isLoading }: OrdersTableProps) => {
  return (
    <DataTable
      data={orders}
      columns={[
        {
          key: 'id',
          header: 'Order ID',
          render: (order) => (
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => onViewOrder(order)}
            >
              #{order.id}
            </Button>
          ),
        },
        {
          key: 'customer',
          header: 'Customer',
          render: (order) => order.user_name,
        },
        {
          key: 'total',
          header: 'Total',
          render: (order) => formatCurrency(order.total),
        },
        {
          key: 'status',
          header: 'Status',
          render: (order) => <StatusBadge status={order.status} />,
        },
        {
          key: 'date',
          header: 'Date',
          render: (order) => formatDate(order.created_at),
        },
        {
          key: 'time',
          header: 'Time',
          render: (order) => formatTime(order.created_at),
        },
        {
          key: 'actions',
          header: 'Actions',
          width: '100px',
          render: (order) => (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewOrder(order)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          ),
        },
      ]}
      keyExtractor={(order) => order.id}
      isLoading={isLoading}
      emptyMessage="No orders found"
      emptyIcon={Package}
    />
  );
};