import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Service, InsertService } from "@shared/schema";
import { insertServiceSchema } from "@shared/schema";
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

export default function ServicesManagement() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const form = useForm<InsertService & { additionalImages?: string }>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      imageUrl: "",
      imageUrls: [],
      category: "",
      isActive: true,
      additionalImages: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertService) => {
      const res = await apiRequest("POST", "/api/services", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service created successfully" });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertService> }) => {
      const res = await apiRequest("PATCH", `/api/services/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service updated successfully" });
      setDialogOpen(false);
      setEditingService(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertService & { additionalImages?: string }) => {
    const { additionalImages, ...serviceData } = data;
    const imageUrls = additionalImages
      ? additionalImages.split('\n').map(url => url.trim()).filter(url => url.length > 0)
      : [];
    
    const finalData = {
      ...serviceData,
      imageUrls: imageUrls.length > 0 ? imageUrls : [],
    };
    
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: finalData });
    } else {
      createMutation.mutate(finalData);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.reset({
      title: service.title,
      description: service.description,
      price: service.price,
      imageUrl: service.imageUrl,
      imageUrls: service.imageUrls || [],
      category: service.category,
      isActive: service.isActive,
      additionalImages: service.imageUrls?.join('\n') || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingService(null);
    form.reset({
      title: "",
      description: "",
      price: 0,
      imageUrl: "",
      imageUrls: [],
      category: "",
      isActive: true,
      additionalImages: "",
    });
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading services...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} data-testid="button-add-service">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-service-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="input-service-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (BDT)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-service-price"
                        />
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
                      <FormLabel>Primary Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Main service image" data-testid="input-service-imageUrl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Images (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="One image URL per line" rows={4} data-testid="textarea-service-images" />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">Enter one image URL per line for gallery</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-service-category" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          <SelectTrigger data-testid="select-service-isActive">
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
                    data-testid="button-submit-service"
                  >
                    {editingService ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <div
            key={service.id}
            className="bg-card border border-card-border rounded-md p-6"
            data-testid={`card-service-${service.id}`}
          >
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
            <p className="text-lg font-bold text-primary mb-2">৳{service.price}</p>
            <p className="text-sm mb-4">
              Category: <span className="font-medium">{service.category}</span>
            </p>
            <p className="text-sm mb-4">
              Status: <span className={service.isActive ? "text-green-600" : "text-red-600"}>
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(service)}
                data-testid={`button-edit-service-${service.id}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(service.id)}
                disabled={deleteMutation.isPending}
                data-testid={`button-delete-service-${service.id}`}
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
