import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin,
  User,
  Phone,
  Mail,
  ShoppingBag
} from "lucide-react";

interface OrderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any | null;
}

export const OrderDrawer = ({ open, onOpenChange, order }: OrderDrawerProps) => {
  if (!order) return null;

  // Status timeline configuration
  const getStatusTimeline = () => {
    const allStatuses = [
      { key: 'preparing', label: 'Preparing', icon: Package },
      { key: 'assigning', label: 'Ready for Pickup', icon: Clock },
      { key: 'assigned', label: 'Partner Assigned', icon: User },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const currentStatusIndex = allStatuses.findIndex(s => s.key === order.status);
    
    return allStatuses.map((status, index) => ({
      ...status,
      completed: index <= currentStatusIndex,
      active: status.key === order.status,
      timestamp: order.status_history?.find((h: any) => h.status === status.key)?.timestamp,
    }));
  };

  const timeline = getStatusTimeline();

  // Format currency
  const formatCurrency = (amount: string | number) => {
    return `₹${parseFloat(amount?.toString() || '0').toFixed(2)}`;
  };

  // Format date/time
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order #{order.id}
          </SheetTitle>
          <SheetDescription>
            Complete order details and status history
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <StatusBadge status={order.status} />
                <span className="text-sm text-muted-foreground">
                  {order.created_at && formatDateTime(order.created_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Timeline</CardTitle>
              <CardDescription>Track your order progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((status, index) => {
                  const Icon = status.icon;
                  return (
                    <div key={status.key} className="flex gap-4">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`
                          rounded-full p-2 
                          ${status.completed 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                          }
                          ${status.active ? 'ring-2 ring-primary ring-offset-2' : ''}
                        `}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {index < timeline.length - 1 && (
                          <div className={`
                            w-0.5 h-12 mt-2
                            ${status.completed ? 'bg-primary' : 'bg-muted'}
                          `} />
                        )}
                      </div>

                      {/* Status details */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${status.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {status.label}
                          </p>
                          {status.active && (
                            <Badge variant="secondary">Current</Badge>
                          )}
                        </div>
                        {status.timestamp && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDateTime(status.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Items</CardTitle>
              <CardDescription>
                {order.items?.length || 0} item(s) in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      {/* Product image */}
                      {item.product_image ? (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}

                      {/* Product details */}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name || 'Product'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity || 1}
                          </span>
                          <span className="text-sm text-muted-foreground">×</span>
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(item.price || 0)}
                          </span>
                        </div>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Variant: {item.variant}
                          </p>
                        )}
                      </div>

                      {/* Item total */}
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency((item.quantity || 1) * (parseFloat(item.price || 0)))}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items found</p>
                  </div>
                )}
              </div>

              {/* Order summary */}
              {order.items && order.items.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(order.subtotal || order.total || 0)}</span>
                    </div>
                    {order.delivery_charge && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span>{formatCurrency(order.delivery_charge)}</span>
                      </div>
                    )}
                    {order.app_fee && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span>{formatCurrency(order.app_fee)}</span>
                      </div>
                    )}
                    {order.tax && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                    )}
                    {order.discount && parseFloat(order.discount) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>- {formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    {order.tip_amount && parseFloat(order.tip_amount) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Tip</span>
                        <span>- {formatCurrency(order.tip_amount)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>{formatCurrency(order.total || 0)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{order.user_name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{order.user_email || 'N/A'}</p>
              </div>
              {order.user_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{order.user_phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Information */}
          {order.delivery_partner_name && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Delivery Partner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{order.delivery_partner_name}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery Address */}
          {order.delivery_address && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {order.delivery_address.address}<br />
                  {order.delivery_address.city}, {order.delivery_address.state}<br />
                  {order.delivery_address.pincode}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">#{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium capitalize">
                  {order.payment_method || 'N/A'}
                </span>
              </div>
              {order.created_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-medium">
                    {formatDateTime(order.created_at)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};