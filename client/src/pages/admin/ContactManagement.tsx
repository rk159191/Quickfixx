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

const contactSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  whatsapp: z.string().min(1, "WhatsApp is required"),
  email: z.string().email("Invalid email"),
  facebook: z.string().min(1, "Facebook URL is required"),
  instagram: z.string().min(1, "Instagram URL is required"),
  tiktok: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactManagement() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: contactData } = useQuery({
    queryKey: ["/api/contact"],
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactData || {
      phone: "+880 1537-313652",
      whatsapp: "+8801537313652",
      email: "info@quickfixx.com",
      facebook: "facebook.com/Quickfixx24",
      instagram: "instagram.com/Quickfixx24",
      tiktok: "",
      linkedin: "",
      twitter: "",
      youtube: "",
    },
  });

  useEffect(() => {
    if (contactData) {
      form.reset(contactData);
    }
  }, [contactData, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const res = await apiRequest("PATCH", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Contact information updated successfully" });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Information</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          data-testid="button-edit-contact"
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <Card className="p-6 max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-whatsapp" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} data-testid="input-contact-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-facebook" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-instagram" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-tiktok" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-linkedin" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter/X URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-twitter" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-youtube" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  data-testid="button-cancel-contact"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-save-contact"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Phone & WhatsApp</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-lg font-medium" data-testid="text-contact-phone">
                  {form.getValues("phone")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
                <p className="text-lg font-medium" data-testid="text-contact-whatsapp">
                  {form.getValues("whatsapp")}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Email & Social Media</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium" data-testid="text-contact-email">
                  {form.getValues("email")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Facebook</p>
                <p className="text-sm font-medium" data-testid="text-contact-facebook">
                  {form.getValues("facebook")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Instagram</p>
                <p className="text-sm font-medium" data-testid="text-contact-instagram">
                  {form.getValues("instagram")}
                </p>
              </div>
              {form.getValues("tiktok") && (
                <div>
                  <p className="text-sm text-muted-foreground">TikTok</p>
                  <p className="text-sm font-medium" data-testid="text-contact-tiktok">
                    {form.getValues("tiktok")}
                  </p>
                </div>
              )}
              {form.getValues("linkedin") && (
                <div>
                  <p className="text-sm text-muted-foreground">LinkedIn</p>
                  <p className="text-sm font-medium" data-testid="text-contact-linkedin">
                    {form.getValues("linkedin")}
                  </p>
                </div>
              )}
              {form.getValues("twitter") && (
                <div>
                  <p className="text-sm text-muted-foreground">Twitter/X</p>
                  <p className="text-sm font-medium" data-testid="text-contact-twitter">
                    {form.getValues("twitter")}
                  </p>
                </div>
              )}
              {form.getValues("youtube") && (
                <div>
                  <p className="text-sm text-muted-foreground">YouTube</p>
                  <p className="text-sm font-medium" data-testid="text-contact-youtube">
                    {form.getValues("youtube")}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
