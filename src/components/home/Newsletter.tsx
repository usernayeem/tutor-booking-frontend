"use client";

import { Send, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 -z-10" />
      <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                <BellRing className="h-4 w-4" />
                <span>Stay Updated</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Join our newsletter for expert learning tips
              </h2>
              <p className="text-muted-foreground text-lg">
                Get weekly insights, study guides, and special discounts delivered straight to your inbox.
              </p>
            </div>

            <div className="flex-1 w-full max-w-sm">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative group">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-4 pr-12 rounded-2xl bg-background border-border focus-visible:ring-primary transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Send className="h-5 w-5" />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isLoading ? "Subscribing..." : "Subscribe Now"}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
