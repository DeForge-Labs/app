"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function PayPalCreditModal({ isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  const createOrder = async () => {
    try {
      setIsLoading(true);
      
      // Call your backend API to create PayPal order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: "10.00", // Default amount for credits
          currency: "USD",
          userEmail: user?.email,
          type: "credits"
        }),
      });

      const orderData = await response.json();
      
      if (orderData.success && orderData.orderId) {
        return orderData.orderId;
      } else {
        throw new Error(orderData.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create payment order");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data) => {
    try {
      setIsLoading(true);
      
      // Call your backend API to capture PayPal payment
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/capture-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          orderID: data.orderID,
          userEmail: user?.email,
          type: "credits"
        }),
      });

      const orderData = await response.json();
      
      if (orderData.success) {
        toast.success("Payment successful! Credits added to your account.");
        onSuccess && onSuccess();
        onClose();
      } else {
        throw new Error(orderData.message || "Payment capture failed");
      }
    } catch (error) {
      console.error("Error capturing order:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (err) => {
    console.error("PayPal Error:", err);
    toast.error("Payment failed. Please try again.");
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
          <h3 className="text-xl font-medium dark:text-background">Buy Credits</h3>
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
              <h4 className="text-lg font-semibold dark:text-background">Complete Your Purchase</h4>
              <p className="text-sm text-gray-600 dark:text-background/70">
                You'll be redirected to PayPal to complete your payment securely.
              </p>
            </div>

            <div className="pt-4 pr-4 pl-4 pb-2 bg-gray-50 rounded-md">
              {!isLoading ? (
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "black",
                    shape: "pill",
                    label: "pay",
                    disableMaxWidth: true,
                  }}
                  createOrder={createOrder}
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
