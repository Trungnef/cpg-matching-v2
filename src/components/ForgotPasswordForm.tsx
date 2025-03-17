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
import { useTranslation } from "react-i18next";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form schema
  const formSchema = z.object({
    email: z.string().email({ message: t('invalid-email', "Please enter a valid email address") }),
  });

  type FormValues = z.infer<typeof formSchema>;

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
        title: t('reset-link-sent', 'Reset link sent'),
        description: t('reset-link-sent-desc', 'If an account exists with that email, you\'ll receive password reset instructions.'),
      });
      
      form.reset();
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: t('request-failed', 'Request failed'),
        description: t('reset-link-error', 'There was a problem sending your reset link. Please try again.'),
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
          {t('back-to-login', 'Back to login')}
        </Button>
        <h2 className="text-2xl font-bold">{t('reset-your-password', 'Reset your password')}</h2>
        <p className="text-muted-foreground mt-2">
          {t('reset-password-instruction', 'Enter your email address and we\'ll send you instructions to reset your password.')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email', 'Email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('email-placeholder', 'your@email.com')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('sending-reset-link', 'Sending reset link...') : t('send-reset-link', 'Send reset link')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
