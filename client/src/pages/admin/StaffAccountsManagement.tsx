import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertStaffUserSchema } from "@shared/schema";
import type { StaffUser, InsertStaffUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export default function StaffAccountsManagement() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: staffAccounts, isLoading } = useQuery<StaffUser[]>({
    queryKey: ["/api/staff-accounts"],
  });

  const form = useForm<InsertStaffUser>({
    resolver: zodResolver(insertStaffUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      role: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertStaffUser) => {
      const res = await apiRequest("POST", "/api/staff-accounts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff-accounts"] });
      toast({ title: "Staff account created successfully" });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create staff account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/staff-accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff-accounts"] });
      toast({ title: "Staff account deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete staff account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStaffUser) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this staff account?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading staff accounts...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Accounts</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-staff">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Staff Account</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-staff-username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          data-testid="input-staff-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-staff-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Technician, Support"
                          data-testid="input-staff-role"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-staff"
                  >
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {staffAccounts?.map((account) => (
          <div
            key={account.id}
            className="bg-card border rounded-lg p-4 flex justify-between items-center"
            data-testid={`card-staff-${account.id}`}
          >
            <div>
              <h3 className="font-semibold">{account.name}</h3>
              <p className="text-sm text-muted-foreground">
                @{account.username} • {account.role}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(account.id)}
              disabled={deleteMutation.isPending}
              data-testid={`button-delete-staff-${account.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
