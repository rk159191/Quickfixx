import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Staff, InsertStaff } from "@shared/schema";
import { insertStaffSchema } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function StaffManagement() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [expertiseInput, setExpertiseInput] = useState("");

  const { data: staff, isLoading } = useQuery<Staff[]>({
    queryKey: ["/api/staff"],
  });

  const form = useForm<InsertStaff>({
    resolver: zodResolver(insertStaffSchema),
    defaultValues: {
      employeeId: "",
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      expertise: [],
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertStaff) => {
      const res = await apiRequest("POST", "/api/staff", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({ title: "Staff member created successfully" });
      setDialogOpen(false);
      form.reset();
      setExpertiseInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertStaff> }) => {
      const res = await apiRequest("PATCH", `/api/staff/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({ title: "Staff member updated successfully" });
      setDialogOpen(false);
      setEditingStaff(null);
      form.reset();
      setExpertiseInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({ title: "Staff member deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStaff) => {
    const expertise = expertiseInput
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);
    const staffData = { ...data, expertise };

    if (editingStaff) {
      updateMutation.mutate({ id: editingStaff.id, data: staffData });
    } else {
      createMutation.mutate(staffData);
    }
  };

  const handleEdit = (member: Staff) => {
    setEditingStaff(member);
    form.reset({
      employeeId: member.employeeId,
      name: member.name,
      role: member.role,
      bio: member.bio,
      imageUrl: member.imageUrl,
      expertise: member.expertise,
      isActive: member.isActive,
    });
    setExpertiseInput(member.expertise.join(", "));
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingStaff(null);
    form.reset({
      employeeId: "",
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      expertise: [],
      isActive: true,
    });
    setExpertiseInput("");
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading staff...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} data-testid="button-add-staff">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-staff-employeeId" />
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
                      <FormLabel>Name</FormLabel>
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
                        <Input {...field} data-testid="input-staff-role" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="input-staff-bio" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-staff-imageUrl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel>Expertise (comma-separated)</FormLabel>
                  <Input
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="e.g., CCTV Installation, Smart Home Setup"
                    data-testid="input-staff-expertise"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-staff-isActive">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
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
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit-staff"
                  >
                    {editingStaff ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff?.map((member) => (
          <div
            key={member.id}
            className="bg-card border border-card-border rounded-md p-6"
            data-testid={`card-staff-${member.id}`}
          >
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
            <p className="text-sm text-center text-muted-foreground mb-2">{member.role}</p>
            <p className="text-xs text-center text-muted-foreground mb-4">ID: {member.employeeId}</p>
            <p className="text-sm mb-4">{member.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {member.expertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {exp}
                </span>
              ))}
            </div>
            <p className="text-sm mb-4">
              Status: <span className={member.isActive ? "text-green-600" : "text-red-600"}>
                {member.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(member)}
                data-testid={`button-edit-staff-${member.id}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(member.id)}
                disabled={deleteMutation.isPending}
                data-testid={`button-delete-staff-${member.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
