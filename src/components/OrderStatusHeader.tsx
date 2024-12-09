import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "../config/order-status-config";

type Props = {
  order: Order;
};

const OrderStatusHeader: React.FC<Props> = ({ order }) => {
  const getOrderStatusInfo = useCallback(() => {
    const statusInfo =
      ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0];

    if (order.status === "placed") {
      return {
        ...statusInfo,
        label: `${statusInfo.label} (Awaiting order confirmation)`,
      };
    }

    if (order.status === "resolved") {
      return {
        ...statusInfo,
        label: "Resolved (Archived)",
      };
    }

    return statusInfo;
  }, [order.status]);

  const showPopupOnStatusChange = useCallback(
    (status: string) => {
      const toastKey = `toast-${order._id}-${status}`;
      console.log("Checking toast condition for status:", { orderId: order._id, status });
  
      if (localStorage.getItem(toastKey)) {
        console.log("Toast already shown for this status");
        return;
      }
  
      if (status === "confirmed") {
        console.log("Order confirmed, showing payment button notification");
        toast.success(
          "Your order has been confirmed. Please click the green button to proceed with payment."
        );
      } else if (status === "paid") {
        toast.success("Your order has been successfully paid.");
      } else if (status === "rejected" && order.rejectionMessage?.message) {
        toast.error(
          `Your order has been rejected. Reason: ${order.rejectionMessage.message}`
        );
      } else if (status === "resolved" && order.resolutionMessage?.message) {
        toast.success(
          `Your order has been resolved. Note: ${order.resolutionMessage.message}`
        );
      }
  
      localStorage.setItem(toastKey, "true");
    },
    [order.rejectionMessage, order.resolutionMessage, order._id]
  );
  
  

  useEffect(() => {
    showPopupOnStatusChange(order.status);
  }, [order.status, showPopupOnStatusChange]);

  const statusInfo = getOrderStatusInfo();

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
        <span> Order Status: {statusInfo.label}</span>
      </h1>
      <Progress
        className="animate-pulse"
        value={statusInfo.progressValue || 0}
      />
    </>
  );
};

export default OrderStatusHeader;
