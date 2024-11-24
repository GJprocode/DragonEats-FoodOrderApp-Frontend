import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Order, OrderStatus } from "@/types";
import { useUpdateMyRestaurantOrder } from "@/api/MyRestaurantApi";

type Props = {
  order: Order;
};

const OrderItemCard = ({ order }: Props) => {
  const { updateRestaurantStatus, isLoading } = useUpdateMyRestaurantOrder();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"rejected" | "resolved" | null>(null);
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
      rejected: {
        beforePay: "Out of stock, dragons flying to get ingredients.",
        afterPay: "Refund pending.",
      },
      resolved: {
        beforePay: "Order cancelled due to stock issues and dragons' wings.",
        afterPay: "Underground dragons refunded successfully.",
      },
    };

    const dialogMessage =
      newStatus === "rejected"
        ? isBeforePay
          ? defaultMessages.rejected.beforePay
          : defaultMessages.rejected.afterPay
        : isBeforePay
        ? defaultMessages.resolved.beforePay
        : defaultMessages.resolved.afterPay;

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
        rejected: {
          beforePay: "Out of stock, dragons flying to get ingredients.",
          afterPay: "Refund pending.",
        },
        resolved: {
          beforePay: "Order cancelled due to stock issues and dragons' wings.",
          afterPay: "Underground dragons refunded successfully.",
        },
      };

      const message =
        dialogType === "rejected"
          ? isBeforePay
            ? defaultMessages.rejected.beforePay
            : defaultMessages.rejected.afterPay
          : isBeforePay
          ? defaultMessages.resolved.beforePay
          : defaultMessages.resolved.afterPay;

      await updateRestaurantStatus({
        orderId: order._id,
        status: newStatus,
        message,
      });
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
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
    const deliveryPrice = order.restaurant.deliveryPrice || 0;
    return ((itemsTotal + deliveryPrice) / 100).toFixed(2);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="grid md:grid-cols-4 gap-4 justify-between mb-3">
            <div>
              Customer Name:
              <span className="ml-2 font-normal">{order.deliveryDetails.name}</span>
            </div>
            <div>
              Delivery Address:
              <span className="ml-2 font-normal">
                {order.deliveryDetails.address}, {order.deliveryDetails.city}
              </span>
            </div>
            <div>
              Restaurant Contact:
              <span className="ml-2 font-normal">{order.restaurant.cellphone}</span>
            </div>
            <div>
              Total Cost:
              <span className="ml-2 font-normal">${calculateTotalAmount()}</span>
            </div>
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
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
