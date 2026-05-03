"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4 py-8">
      <Card className="w-full max-w-md shadow-2xl border-primary/10 overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create a student account</CardTitle>
          <CardDescription>
            Join TutorBooking and start your educational journey
          </CardDescription>
        </CardHeader>

        {/* Info note */}
        <div className="mx-6 mb-2 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          <strong>Note:</strong> This form registers you as a <strong>Student</strong>. Tutor accounts are created by administrators.
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-semibold tracking-wide">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative group flex items-center rounded-lg border border-input bg-background/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
                        <div className="flex h-10 w-11 items-center justify-center border-r border-input/50 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <User className="h-4 w-4" />
                        </div>
                        <Input 
                          placeholder="John Doe" 
                          className="border-0 bg-transparent h-10 pl-3 focus-visible:ring-0 focus-visible:border-0"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-semibold tracking-wide">Email</FormLabel>
                    <FormControl>
                      <div className="relative group flex items-center rounded-lg border border-input bg-background/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
                        <div className="flex h-10 w-11 items-center justify-center border-r border-input/50 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Mail className="h-4 w-4" />
                        </div>
                        <Input 
                          type="email" 
                          placeholder="m@example.com" 
                          className="border-0 bg-transparent h-10 pl-3 focus-visible:ring-0 focus-visible:border-0"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-semibold tracking-wide">Password</FormLabel>
                    <FormControl>
                      <div className="relative group flex items-center rounded-lg border border-input bg-background/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
                        <div className="flex h-10 w-11 items-center justify-center border-r border-input/50 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          className="border-0 bg-transparent h-10 pl-3 pr-10 focus-visible:ring-0 focus-visible:border-0"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-semibold tracking-wide">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative group flex items-center rounded-lg border border-input bg-background/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
                        <div className="flex h-10 w-11 items-center justify-center border-r border-input/50 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Repeat your password"
                          className="border-0 bg-transparent h-10 pl-3 pr-10 focus-visible:ring-0 focus-visible:border-0"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                id="register-submit-btn"
                className="w-full h-10 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Student Account"
                )}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col py-4 bg-muted/30 border-t border-input/20">

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
