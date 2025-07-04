// components/expert/dashboard/payment-setup/stripe-connection-card.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/auth/use-auth";
import supabase from "@/lib/supabase/supabase-client";
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Clock,
  Loader2
} from "lucide-react";

interface StripeAccount {
  id: string;
  email: string;
  country: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  status: 'pending' | 'verified' | 'restricted';
}

const StripeConnectionCard = () => {
  const { user, isExpert } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [expertId, setExpertId] = useState<string | null>(null);

  // Get expert ID from database
  useEffect(() => {
    const getExpertId = async () => {
      if (!user || !isExpert) return;

      try {
        const { data: expert, error } = await supabase
          .from('experts')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (expert && !error) {
          setExpertId(expert.id);
        }
      } catch (error) {
        console.error('Error fetching expert ID:', error);
      }
    };

    getExpertId();
  }, [user, isExpert]);

  // Fetch Stripe connection status
  useEffect(() => {
    const fetchStripeStatus = async () => {
      if (!expertId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/stripe/connect-account?expertId=${expertId}`);
        const data = await response.json();

        if (data.success) {
          setIsConnected(data.isConnected);
          setStripeAccount(data.account || null);
        }
      } catch (error) {
        console.error('Error fetching Stripe status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStripeStatus();
  }, [expertId]);

  const handleConnectStripe = async () => {
    if (!expertId || !user) return;

    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/stripe/connect-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          expertId: expertId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.onboardingUrl;
      } else {
        console.error('Failed to create Stripe account:', data.error);
        alert('Failed to connect Stripe account. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading payment setup...</span>
      </div>
    );
  }

  // Not an expert
  if (!isExpert) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Payment setup is only available for experts.</p>
      </div>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Connect your Stripe account to receive payments
          </h3>
          <p className="text-gray-600">
            You need to connect your Stripe account before you can start receiving payments from clients.
          </p>
          <Button 
            className="mt-6"
            onClick={handleConnectStripe}
            disabled={isConnecting || !expertId}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Connect with Stripe
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Connected State
  return (
    <div className="space-y-6">
      {/* Status Alerts */}
      {stripeAccount?.status === 'pending' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Your Stripe account is being verified. This usually takes 1-2 business days.
          </AlertDescription>
        </Alert>
      )}

      {stripeAccount?.status === 'restricted' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Your Stripe account requires additional information. Please complete the verification process.
          </AlertDescription>
        </Alert>
      )}

      {/* Connected Account Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {stripeAccount?.status === 'verified' ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : stripeAccount?.status === 'pending' ? (
                <Clock className="h-12 w-12 text-yellow-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-red-500" />
              )}
              <div>
                <CardTitle className="text-xl">Stripe Account Connected</CardTitle>
                <CardDescription>
                  {stripeAccount?.email && `Connected as ${stripeAccount.email}`}
                </CardDescription>
              </div>
            </div>
            {stripeAccount?.status === 'verified' ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
            ) : stripeAccount?.status === 'pending' ? (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Action Required</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Payment Status</h4>
              <p className="text-sm text-gray-600">
                {stripeAccount?.status === 'verified' ? 'Ready to receive payments' : 'Verification in progress'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Payout Schedule</h4>
              <p className="text-sm text-gray-600">2-7 business days after session</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Manage on Stripe
            </Button>
            
            {stripeAccount?.status === 'restricted' && (
              <Button size="sm" onClick={handleConnectStripe}>
                Complete Verification
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Disconnect Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeConnectionCard;