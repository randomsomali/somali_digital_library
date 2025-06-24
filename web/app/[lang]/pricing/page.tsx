"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getSubscriptionPlans } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Crown, Check, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SubscriptionPlan {
  subscription_id: number;
  name: string;
  type: string;
  price: number;
  duration_days: number;
}

export default function PricingPage({ params }: { params: { lang: string } }) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("resource");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const subscriptionPlans = await getSubscriptionPlans();
        setPlans(subscriptionPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription plans",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

  const handleSubscriptionSelection = (plan: SubscriptionPlan) => {
    const userInfo = user ? `${user.name} (${user.email})` : "Guest User";
    const resourceInfo = resourceId ? `\nResource ID: ${resourceId}` : "";

    const message = `Hello! I would like to subscribe to the ${plan.name} plan for $${plan.price}.

User Details: ${userInfo}${resourceInfo}

Please set up my subscription manually. Thank you!`;

    const whatsappUrl = `https://wa.me/+252612995362?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "WhatsApp Opened",
      description:
        "Please send the message to complete your subscription request",
    });
  };

  const userPlans = plans.filter((plan) => plan.type === "user");
  const institutionPlans = plans.filter((plan) => plan.type === "institution");

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading subscription plans...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link href={`/${params.lang}/resources`}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Resources
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Choose Your Subscription Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock access to premium resources and enhance your learning
              experience
            </p>
          </div>

          {/* User Plans */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Individual Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPlans.map((plan) => (
                <Card
                  key={plan.subscription_id}
                  className="relative hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">
                      ${plan.price}
                    </div>
                    <p className="text-muted-foreground">
                      {plan.duration_days} days
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Access to all premium resources
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Unlimited downloads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Priority support</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-primary hover:bg-gradient-primary-hover"
                      onClick={() => handleSubscriptionSelection(plan)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-12" />

          {/* Institution Plans */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Institution Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institutionPlans.map((plan) => (
                <Card
                  key={plan.subscription_id}
                  className="relative hover:shadow-lg transition-shadow"
                >
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="default" className="bg-primary">
                      <Crown className="h-3 w-3 mr-1" />
                      Institution
                    </Badge>
                  </div>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">
                      ${plan.price}
                    </div>
                    <p className="text-muted-foreground">
                      {plan.duration_days} days
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Access for all students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Admin dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Usage analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Dedicated support</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-primary hover:bg-gradient-primary-hover"
                      onClick={() => handleSubscriptionSelection(plan)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">How it works</h3>
                <p className="text-muted-foreground">
                  Click on any plan to contact us via WhatsApp. We&apos;ll set
                  up your subscription manually and provide you with access
                  credentials within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
