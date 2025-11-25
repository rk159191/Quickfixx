import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Gallery, InsertGallery } from "@shared/schema";
import { insertGallerySchema } from "@shared/schema";
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

export default function GalleryManagement() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);

  const { data: gallery, isLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery"],
  });

  const form = useForm<InsertGallery>({
    resolver: zodResolver(insertGallerySchema),
    defaultValues: {
      beforeImageUrl: "",
      afterImageUrl: "",
      videoUrl: "",
      title: "",
      description: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGallery) => {
      const res = await apiRequest("POST", "/api/gallery", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Gallery item created successfully" });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create gallery item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGallery> }) => {
      const res = await apiRequest("PATCH", `/api/gallery/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Gallery item updated successfully" });
      setDialogOpen(false);
      setEditingGallery(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update gallery item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Gallery item deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete gallery item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertGallery) => {
    if (editingGallery) {
      updateMutation.mutate({ id: editingGallery.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: Gallery) => {
    setEditingGallery(item);
    form.reset({
      beforeImageUrl: item.beforeImageUrl || "",
      afterImageUrl: item.afterImageUrl || "",
      videoUrl: item.videoUrl || "",
      title: item.title,
      description: item.description,
      isActive: item.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingGallery(null);
    form.reset({
      beforeImageUrl: "",
      afterImageUrl: "",
      videoUrl: "",
      title: "",
      description: "",
      isActive: true,
    });
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Loading gallery...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} data-testid="button-add-gallery">
              <Plus className="mr-2 h-4 w-4" />
              Add Gallery Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingGallery ? "Edit Gallery Item" : "Add New Gallery Item"}</DialogTitle>
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
                        <Input {...field} data-testid="input-gallery-title" />
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
                        <Textarea {...field} data-testid="input-gallery-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="beforeImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Before Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-gallery-beforeImageUrl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="afterImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>After Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-gallery-afterImageUrl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (YouTube, Vimeo, or direct video link)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://youtube.com/watch?v=..." data-testid="input-gallery-videoUrl" />
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
                          <SelectTrigger data-testid="select-gallery-isActive">
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
                    data-testid="button-submit-gallery"
                  >
                    {editingGallery ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gallery?.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-card-border rounded-md p-6"
            data-testid={`card-gallery-${item.id}`}
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
            <div className="mb-4">
              {item.videoUrl ? (
                <div>
                  <p className="text-sm font-medium mb-2">Video</p>
                  <div className="bg-black rounded-md h-48 flex items-center justify-center">
                    <p className="text-white text-sm">{item.videoUrl}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {item.beforeImageUrl && (
                    <div>
                      <p className="text-sm font-medium mb-2">Before</p>
                      <img
                        src={item.beforeImageUrl}
                        alt="Before"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                  {item.afterImageUrl && (
                    <div>
                      <p className="text-sm font-medium mb-2">After</p>
                      <img
                        src={item.afterImageUrl}
                        alt="After"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm mb-4">
              Status: <span className={item.isActive ? "text-green-600" : "text-red-600"}>
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(item)}
                data-testid={`button-edit-gallery-${item.id}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(item.id)}
                disabled={deleteMutation.isPending}
                data-testid={`button-delete-gallery-${item.id}`}
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
