"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function PayPalSubscriptionModal({ isOpen, onClose, onSuccess, planId = "pro" }) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  const createSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Call your backend API to create PayPal subscription
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/create-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          planId: "P-2KG18973UC126193UNCJ3V3A", // Your provided subscription plan ID
          userEmail: user?.email,
          type: "subscription"
        }),
      });

      const subscriptionData = await response.json();
      
      if (subscriptionData.success && subscriptionData.subscriptionId) {
        return subscriptionData.subscriptionId;
      } else {
        throw new Error(subscriptionData.message || "Failed to create subscription");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Failed to create subscription");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data) => {
    try {
      setIsLoading(true);
      
      // Call your backend API to activate PayPal subscription
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/activate-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subscriptionID: data.subscriptionID,
          userEmail: user?.email,
          planId: planId
        }),
      });

      const subscriptionData = await response.json();
      
      if (subscriptionData.success) {
        toast.success("Subscription activated! Welcome to Pro plan!");
        onSuccess && onSuccess();
        onClose();
      } else {
        throw new Error(subscriptionData.message || "Subscription activation failed");
      }
    } catch (error) {
      console.error("Error activating subscription:", error);
      toast.error("Subscription activation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (err) => {
    console.error("PayPal Error:", err);
    toast.error("Subscription failed. Please try again.");
    setIsLoading(false);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      className="border border-black bg-background p-1 dark:bg-dark dark:border-background"
      closeButton={<div></div>}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <h3 className="text-xl font-medium dark:text-background">Upgrade to Pro</h3>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={onClose}
            className="hover:text-black dark:text-background/60 dark:hover:text-background"
          >
            <X className="h-4 w-4" />
          </Button>
        </ModalHeader>
        <ModalBody className="pb-6">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h4 className="text-lg font-semibold dark:text-background">Upgrade to Pro Plan</h4>
              <p className="text-sm text-gray-600 dark:text-background/70">
                You'll be redirected to PayPal to set up your subscription securely.
              </p>
            </div>
            
            <div className="pt-4 pr-4 pl-4 pb-2 bg-gray-50 rounded-md">
              {!isLoading ? (
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "black",
                    shape: "pill",
                    label: "subscribe",
                    disableMaxWidth: true,
                  }}
                  createSubscription={createSubscription}
                  onApprove={onApprove}
                  onError={onError}
                  disabled={isLoading}
                />
              ) : (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
