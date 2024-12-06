// src/components/OrderItemCard.tsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Order, OrderStatus } from "@/types";
import { useUpdateRestaurantOrderStatus } from "@/api/MyRestaurantApi";
import { toast } from "sonner";

type Props = {
  order: Order;
};

const OrderItemCard = ({ order }: Props) => {
  const { mutate: updateRestaurantStatus, isLoading } =
    useUpdateRestaurantOrderStatus();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"rejected" | "resolved" | null>(
    null
  );
  const [defaultMessage, setDefaultMessage] = useState("");

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    placed: ["confirmed", "rejected"],
    confirmed: ["rejected"],
    paid: ["inProgress", "rejected"],
    inProgress: ["outForDelivery", "rejected"],
    outForDelivery: ["delivered", "rejected"],
    delivered: [],
    rejected: ["resolved"],
    resolved: [],
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!validTransitions[status]?.includes(newStatus)) {
      alert("Invalid status transition.");
      return;
    }

    const isBeforePay = ["placed", "confirmed"].includes(order.status);
    const defaultMessages = {
      rejected: isBeforePay
        ? "Out of stock, dragons flying to get ingredients."
        : "Refund pending.",
      resolved: isBeforePay
        ? "Order resolved before payment, no refund needed."
        : "Order resolved after payment, refund paid.",
    };

    const dialogMessage =
      newStatus === "rejected"
        ? defaultMessages.rejected
        : defaultMessages.resolved;

    if (newStatus === "rejected" || newStatus === "resolved") {
      setDialogType(newStatus);
      setDefaultMessage(dialogMessage);
      setShowDialog(true);
    } else {
      updateOrder(newStatus);
    }
  };

  const updateOrder = async (newStatus: OrderStatus) => {
    try {
      const isBeforePay = ["placed", "confirmed"].includes(order.status);
      const defaultMessages = {
        rejected: isBeforePay
          ? "Out of stock, dragons flying to get ingredients."
          : "Refund pending.",
        resolved: isBeforePay
          ? "Order resolved before payment, no refund needed."
          : "Order resolved after payment, refund paid.",
      };

      const message =
        newStatus === "rejected"
          ? defaultMessages.rejected
          : defaultMessages.resolved;

      const updatePayload = {
        orderId: order._id,
        status: newStatus,
        ...(newStatus === "rejected" && { message }),
        ...(newStatus === "resolved" && { message }),
      };

      await updateRestaurantStatus(updatePayload);

      if (newStatus !== status) {
        toast.success("Order status updated");
      }

      setStatus(newStatus);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    const dateObj = new Date(date);
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  };

  const calculateTotalAmount = () => {
    const itemsTotal = order.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const deliveryPrice = order.branchDetails?.deliveryPrice ?? 0;
    return ((itemsTotal + deliveryPrice) / 100).toFixed(2);
  };

  // Extract delivery details
  const deliveryPrice = order.branchDetails?.deliveryPrice ?? 0;
  const deliveryTime = order.branchDetails?.deliveryTime ?? 0; // Ensure deliveryTime is defined

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="grid md:grid-cols-4 gap-4 justify-between mb-3">
            <div>
              <strong>Customer Name:</strong>
              <span className="ml-2 font-normal">{order.deliveryDetails.name}</span>
            </div>
            <div>
              <strong>Delivery Address:</strong>
              <span className="ml-2 font-normal">
                {order.deliveryDetails.address}, {order.deliveryDetails.city}
              </span>
            </div>
            <div>
              <strong>Restaurant Contact:</strong>
              <span className="ml-2 font-normal">{order.restaurant.cellphone}</span>
            </div>
            <div>
              <strong>Restaurant Name:</strong>
              <span className="ml-2 font-normal">{order.restaurantName}</span>
            </div>
            <div>
              <strong>Branch Name:</strong>
              <span className="ml-2 font-normal">{order.branchDetails?.branchName}</span>
            </div>
            <div>
              <strong>Total Cost:</strong>
              <span className="ml-2 font-normal">${calculateTotalAmount()}</span>
            </div>
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Ordered On and Delivered On */}
          <div className="flex flex-col gap-2">
            <div>
              <strong>Ordered on:</strong> {formatDate(order.createdAt)}
            </div>
            {order.status === "delivered" && order.dateDelivered && (
              <div>
                <strong>Delivered on:</strong> {formatDate(order.dateDelivered)}
              </div>
            )}
          </div>

          <div>
                <strong>Delivered on:</strong> {formatDate(order.dateDelivered)}
          </div>

          {/* Delivery Cost and Delivery Time */}
          <div className="flex flex-col gap-2">
            
            <div>
              <strong>Estimated Delivery Time:</strong> {deliveryTime} min
            </div>
          </div>
          <div>
              <strong>Delivery Cost:</strong> ${(deliveryPrice / 100).toFixed(2)}
          </div>

          <Separator />

          {/* Menu Items */}
          <div className="flex flex-col gap-2">
            {order.cartItems.map((cartItem) => (
              <span key={cartItem.menuItemId}>
                <Badge variant="outline" className="mr-2">
                  {cartItem.quantity}
                </Badge>
                {cartItem.name} - ${(cartItem.price / 100).toFixed(2)}
              </span>
            ))}
          </div>

          <Separator />

          {/* Order Status */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="status">Order Status:</Label>
            <Select
              value={status}
              disabled={isLoading}
              onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                {Object.keys(validTransitions).map((key) => (
                  <SelectItem
                    key={key}
                    value={key}
                    disabled={!validTransitions[status]?.includes(key as OrderStatus)}
                  >
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to {dialogType === "rejected" ? "reject" : "resolve"} this order?
            </DialogTitle>
          </DialogHeader>
          <p>{defaultMessage}</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowDialog(false);
                updateOrder(dialogType as OrderStatus);
              }}
            >
              Yes
            </Button>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderItemCard;
