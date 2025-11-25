import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function BookingsManagement() {
  const { toast } = useToast();

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Booking status updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update booking status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Booking deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading bookings...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground mt-2">Manage customer service bookings and update their status</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-card rounded-md">
          <thead>
            <tr className="border-b border-card-border">
              <th className="text-left p-4 font-semibold">Customer</th>
              <th className="text-left p-4 font-semibold">Contact</th>
              <th className="text-left p-4 font-semibold">Service</th>
              <th className="text-left p-4 font-semibold">Date & Time</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-card-border hover-elevate"
                data-testid={`row-booking-${booking.id}`}
              >
                <td className="p-4">
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-muted-foreground">{booking.customerAddress}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm">{booking.customerPhone}</p>
                    {booking.customerEmail && (
                      <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium">{booking.serviceType}</p>
                  {booking.details && (
                    <p className="text-sm text-muted-foreground">{booking.details}</p>
                  )}
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm">{booking.preferredDate}</p>
                    <p className="text-sm text-muted-foreground">{booking.preferredTime}</p>
                  </div>
                </td>
                <td className="p-4">
                  <Select
                    value={booking.status}
                    onValueChange={(value) => handleStatusChange(booking.id, value)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger
                      className="w-32"
                      data-testid={`select-status-${booking.id}`}
                    >
                      <SelectValue>
                        <span className={getStatusColor(booking.status)}>
                          {booking.status}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(booking.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-booking-${booking.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!bookings || bookings.length === 0) && (
          <div className="text-center py-12 bg-card rounded-md mt-4">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
