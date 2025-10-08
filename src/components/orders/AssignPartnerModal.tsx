import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, User, Loader2 } from "lucide-react";

interface AssignPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  deliveryRequests: any[];
  isUpdating: boolean;
  onAssign: (partnerId: string) => void;
}

export const AssignPartnerModal = ({
  open,
  onOpenChange,
  order,
  deliveryRequests,
  isUpdating,
  onAssign,
}: AssignPartnerModalProps) => {
  const [selectedPartner, setSelectedPartner] = useState("");

  const handleAssign = () => {
    if (!selectedPartner) return;
    onAssign(selectedPartner);
    setSelectedPartner("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Delivery Partner</DialogTitle>
          <DialogDescription>
            Select from partners who requested order #{order?.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {deliveryRequests.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label>Available Delivery Partners</Label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryRequests.map((partner, idx) => (
                      <SelectItem key={`${partner.id}-${idx}`} value={partner.id}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {deliveryRequests.length} partner(s) available
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button onClick={handleAssign} disabled={isUpdating || !selectedPartner}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Truck className="mr-2 h-4 w-4" />
                      Assign Partner
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No delivery requests</p>
              <p className="text-sm text-muted-foreground">
                No partners have requested this order yet
              </p>
              <Button variant="outline" className="mt-4" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};