import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Package, InsertPackage } from "@shared/schema";
import { insertPackageSchema } from "@shared/schema";
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

export default function PackagesManagement() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [featuresInput, setFeaturesInput] = useState("");

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const form = useForm<InsertPackage>({
    resolver: zodResolver(insertPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      originalPrice: 0,
      discountedPrice: 0,
      features: [],
      isPopular: false,
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPackage) => {
      const res = await apiRequest("POST", "/api/packages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({ title: "Package created successfully" });
      setDialogOpen(false);
      form.reset();
      setFeaturesInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create package",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPackage> }) => {
      const res = await apiRequest("PATCH", `/api/packages/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({ title: "Package updated successfully" });
      setDialogOpen(false);
      setEditingPackage(null);
      form.reset();
      setFeaturesInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update package",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({ title: "Package deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete package",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPackage) => {
    const features = featuresInput
      .split(/[\n,]+/)
      .map((f) => f.trim())
      .filter((f) => f);
    const packageData = { ...data, features };

    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage.id, data: packageData });
    } else {
      createMutation.mutate(packageData);
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    form.reset({
      name: pkg.name,
      description: pkg.description,
      originalPrice: pkg.originalPrice,
      discountedPrice: pkg.discountedPrice,
      features: pkg.features,
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
    });
    setFeaturesInput(pkg.features.join("\n"));
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingPackage(null);
    form.reset({
      name: "",
      description: "",
      originalPrice: 0,
      discountedPrice: 0,
      features: [],
      isPopular: false,
      isActive: true,
    });
    setFeaturesInput("");
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading packages...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Packages Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} data-testid="button-add-package">
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-package-name" />
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
                        <Textarea {...field} data-testid="input-package-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (BDT)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-package-originalPrice"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discounted Price (BDT)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-package-discountedPrice"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormLabel>Features (one per line)</FormLabel>
                  <Textarea
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Enter each feature on a new line"
                    rows={5}
                    data-testid="input-package-features"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Popular Package</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-package-isPopular">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectTrigger data-testid="select-package-isActive">
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
                    data-testid="button-submit-package"
                  >
                    {editingPackage ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages?.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-card border border-card-border rounded-md p-6"
            data-testid={`card-package-${pkg.id}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-semibold">{pkg.name}</h3>
              {pkg.isPopular && (
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                  Popular
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
            <div className="mb-4">
              <span className="text-2xl font-bold text-primary">৳{pkg.discountedPrice}</span>
              <span className="text-lg text-muted-foreground line-through ml-2">
                ৳{pkg.originalPrice}
              </span>
            </div>
            <ul className="space-y-2 mb-4">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="text-sm flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-sm mb-4">
              Status: <span className={pkg.isActive ? "text-green-600" : "text-red-600"}>
                {pkg.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(pkg)}
                data-testid={`button-edit-package-${pkg.id}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(pkg.id)}
                disabled={deleteMutation.isPending}
                data-testid={`button-delete-package-${pkg.id}`}
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
