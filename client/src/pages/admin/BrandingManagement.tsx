import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { z } from "zod";

const brandingSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().optional().default(""),
});

type BrandingFormData = z.infer<typeof brandingSchema>;

export default function BrandingManagement() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const { data: brandingData } = useQuery({
    queryKey: ["/api/branding"],
  });

  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      brandName: "Quickfixx",
      logoUrl: "",
    },
  });

  useEffect(() => {
    if (brandingData) {
      form.reset(brandingData);
      setLogoPreview(brandingData.logoUrl || "");
    }
  }, [brandingData, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: BrandingFormData) => {
      const res = await apiRequest("PATCH", "/api/branding", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Branding updated successfully" });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/branding"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update branding",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setLogoPreview(dataUrl);
        form.setValue("logoUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: BrandingFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Branding Settings</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          data-testid="button-edit-branding"
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <Card className="p-6 max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your brand name"
                        {...field}
                        data-testid="input-brand-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Logo Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      data-testid="input-logo-upload"
                    />
                    {logoPreview && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Logo Preview:
                        </p>
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-32 w-32 object-contain rounded-md border"
                          data-testid="img-logo-preview"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-save-branding"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Current Brand Name</h3>
            <p className="text-2xl font-bold" data-testid="text-current-brand">
              {brandingData?.brandName || "Quickfixx"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Current Logo</h3>
            {brandingData?.logoUrl ? (
              <img
                src={brandingData.logoUrl}
                alt="Current logo"
                className="h-32 w-32 object-contain rounded-md"
                data-testid="img-current-logo"
              />
            ) : (
              <p className="text-muted-foreground">No logo uploaded</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
