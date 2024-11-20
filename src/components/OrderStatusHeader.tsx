// import { Order } from "@/types";
// import { Progress } from "./ui/progress";
// import { ORDER_STATUS } from "../config/order-status-config";

// type Props = {
//   order: Order;
// };

// const OrderStatusHeader = ({ order }: Props) => {
 

//   const getOrderStatusInfo = () => {
//     return (
//       ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
//     );
//   };

//   return (
//     <>
//       <h1 className="text-4xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
//         <span> Order Status: {getOrderStatusInfo().label}</span>

//       </h1>
//       <Progress
//         className="animate-pulse"
//         value={getOrderStatusInfo().progressValue} 
//        />
//     </>
//   );
// };

// export default OrderStatusHeader;



import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "../config/order-status-config";

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const getOrderStatusInfo = useCallback(() => {
    const statusInfo =
      ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0];

    // Add extra text for "placed" status
    if (order.status === "placed") {
      return {
        ...statusInfo,
        label: `${statusInfo.label} (Awaiting order confirmation)`,
      };
    }

    return statusInfo;
  }, [order.status]);

  const showPopupOnStatusChange = useCallback(
    (status: string) => {
      if (status === "confirmed") {
        toast.success(
          "Your order has been confirmed. Please click the green button to proceed with payment."
        );
      } else if (status === "paid") {
        toast.success("Your order has been successfully paid.");
      } else if (status === "rejected") {
        toast.error(
          `Your order has been rejected. Reason: ${
            order.rejectionMessage || "No stock available."
          }`
        );
      }
    },
    [order.rejectionMessage]
  );

  useEffect(() => {
    showPopupOnStatusChange(order.status);
  }, [order.status, showPopupOnStatusChange]);

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
        <span> Order Status: {getOrderStatusInfo().label}</span>
      </h1>
      <Progress
        className="animate-pulse"
        value={getOrderStatusInfo().progressValue}
      />
    </>
  );
};

export default OrderStatusHeader;
