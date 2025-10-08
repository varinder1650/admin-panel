import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCheck, UserX, Shield, User as UserIcon, Truck, Store, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { User } from "@/types/user";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  loadingUserIds: Set<string>;
  onRoleChange: (userId: string, newRole: string) => void;
  onStatusToggle: (userId: string, currentStatus: string) => void;
}

const roleIcons = {
  admin: Shield,
  customer: UserIcon,
  delivery_partner: Truck,
  vendor: Store,
};

export const UsersTable = ({ 
  users, 
  isLoading, 
  loadingUserIds,
  onRoleChange, 
  onStatusToggle 
}: UsersTableProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const Icon = roleIcons[user.role] || UserIcon;
          const isUserLoading = loadingUserIds.has(user._id || user.id);
          
          return (
            <TableRow key={user._id || user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{user.name || user.email}</span>
                  {isUserLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) => onRoleChange(user._id || user.id, value)}
                  disabled={isUserLoading}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="delivery_partner">Delivery Partner</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={user.status} />
                  <Switch
                    checked={user.status === 'active'}
                    onCheckedChange={() => onStatusToggle(user._id || user.id, user.status)}
                    disabled={isUserLoading}
                  />
                </div>
              </TableCell>
              <TableCell>
                {formatDate(user.joined_at || user.created_at || '')}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {user.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStatusToggle(user._id || user.id, user.status)}
                      disabled={isUserLoading}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onStatusToggle(user._id || user.id, user.status)}
                      disabled={isUserLoading}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};