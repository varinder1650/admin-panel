import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Order } from "@/types/order";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { StatusBadge } from "@/components/ui/status-badge";

interface OrderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export const OrderDrawer = ({ open, onOpenChange, order }: OrderDrawerProps) => {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Order #{order.id}</SheetTitle>
          <SheetDescription>
            Order details and customer information
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-medium">Customer</p>
            <p className="text-sm text-muted-foreground">{order.user_name}</p>
            <p className="text-sm text-muted-foreground">{order.user_email}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Delivery Partner</p>
            <StatusBadge status={order.delivery_partner_name} />
          </div>

          <div>
            <p className="text-sm font-medium">Status</p>
            <StatusBadge status={order.status} />
          </div>

          <div>
            <p className="text-sm font-medium">Total</p>
            <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Order Date</p>
            <p className="text-sm text-muted-foreground">{formatDateTime(order.created_at)}</p>
          </div>

          {order.delivery_address && (
            <div>
              <p className="text-sm font-medium">Delivery Address</p>
              <p className="text-sm text-muted-foreground">
                {order.delivery_address.address}<br />
                {order.delivery_address.city}, {order.delivery_address.state}<br />
                {order.delivery_address.pincode}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};