
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

// Form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      console.log("Password reset requested for:", data.email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Reset link sent",
        description: "If an account exists with that email, you'll receive password reset instructions.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Request failed",
        description: "There was a problem sending your reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-xl w-full max-w-md">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="mb-4 -ml-2 text-muted-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to login
        </Button>
        <h2 className="text-2xl font-bold">Reset your password</h2>
        <p className="text-muted-foreground mt-2">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
