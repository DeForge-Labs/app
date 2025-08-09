"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Select, SelectItem, Input } from "@heroui/react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { X, Plus, Minus } from "lucide-react";

// Credit pack options
const creditPacks = [
  { value: "500", label: "500 Credits - $3.00", price: 3.00, credits: 500 },
  { value: "1000", label: "1000 Credits - $5.00", price: 5.00, credits: 1000 },
  { value: "2000", label: "2000 Credits - $8.00", price: 8.00, credits: 2000 },
];

export default function PayPalCreditModal({ isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState("1000"); // Default to $5 for 1000 credits
  const [quantity, setQuantity] = useState(1);
  const user = useSelector((state) => state.user.user);
  const team = useSelector((state) => state.team.team);

  // Helper functions
  const getSelectedPackDetails = () => {
    return creditPacks.find(pack => pack.value === selectedPack);
  };

  const getTotalAmount = () => {
    const pack = getSelectedPackDetails();
    return (pack.price * quantity).toFixed(2);
  };

  const getTotalCredits = () => {
    const pack = getSelectedPackDetails();
    return pack.credits * quantity;
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 5) {
      setQuantity(newQuantity);
    }
  };

  const createOrder = async () => {
    try {
      
      if (!team?.id) {
        throw new Error("Team information not available");
      }
      
      const pack = getSelectedPackDetails();
      const totalAmount = getTotalAmount();
      const totalCredits = getTotalCredits();
      
      // Call your backend API to create PayPal order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "USD",
          type: "credits",
          teamId: team.id,
          creditPack: selectedPack,
          quantity: quantity,
          totalCredits: totalCredits
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
    }
  };

  const onApprove = async (data) => {
    try {
      
      // Call your backend API to capture PayPal payment
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/capture-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          orderID: data.orderID,
          type: "credits",
          teamId: team?.id
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
          <div className="space-y-6">
            {/* Credit Pack Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-background">Select Credit Pack</label>
              <Select
                defaultSelectedKeys={new Set([selectedPack])}
                onSelectionChange={(value) => setSelectedPack(Array.from(value)[0])}
                className="w-full dark:text-gray-50"
                classNames={{
                  trigger: "border border-black/20 dark:border-white/20",
                  value: "dark:text-background"
                }}
              >
                {creditPacks.map((pack) => (
                  <SelectItem key={pack.value} value={pack.value} className="dark:text-gray-50">
                    {pack.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-background">Quantity (Max: 5)</label>
              <div className="flex items-center gap-3">
                <Button
                  isIconOnly
                  variant="outline"
                  size="sm"
                  onPress={() => handleQuantityChange(quantity - 1)}
                  isDisabled={quantity <= 1}
                  className="border border-black/20 dark:border-white/20 text-black dark:text-white"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <Input
                  value={quantity.toString()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    handleQuantityChange(val);
                  }}
                  className="w-20 text-center"
                  classNames={{
                    input: "text-center dark:text-background",
                    inputWrapper: "border border-black/20 dark:border-white/20"
                  }}
                  min={1}
                  max={5}
                  type="number"
                />
                
                <Button
                  isIconOnly
                  variant="outline"
                  size="sm"
                  onPress={() => handleQuantityChange(quantity + 1)}
                  isDisabled={quantity >= 5}
                  className="border border-black/20 dark:border-white/20 text-black dark:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="dark:text-background">Credits:</span>
                <span className="font-medium dark:text-background">{getTotalCredits().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="dark:text-background">Quantity:</span>
                <span className="font-medium dark:text-background">{quantity}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span className="dark:text-background">Total:</span>
                <span className="text-primary">${getTotalAmount()}</span>
              </div>
            </div>

            {/* PayPal Buttons */}
            <div className="">
              {!isLoading ? (
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "black",
                    shape: "pill",
                    label: "pay",
                    disableMaxWidth: true,
                  }}
                  className="bg-gray-50 pt-4 pr-4 pl-4 pb-2 rounded-md"
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
