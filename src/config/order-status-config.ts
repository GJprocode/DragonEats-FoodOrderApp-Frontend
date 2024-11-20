// C:\Users\gertf\Desktop\FoodApp\frontend\src\config\order-status-config.ts

// import { OrderStatus } from "@/types";

// type OrderStatusInfo = {
//   label: string;
//   value: OrderStatus;
//   progressValue: number;
// };

// export const ORDER_STATUS: OrderStatusInfo[] = [
//   { label: "Placed", value: "placed", progressValue: 0 },
//   {
//     label: "Awaiting Restaurant Confirmation",
//     value: "paid",
//     progressValue: 25,
//   },
//   { label: "In Progress", value: "inProgress", progressValue: 50 },
//   { label: "Out for Delivery", value: "outForDelivery", progressValue: 75 },
//   { label: "Delivered", value: "delivered", progressValue: 100 },
// ];


import { OrderStatus } from "@/types";

type OrderStatusInfo = {
  label: string;
  value: OrderStatus;
  progressValue: number;
};

export const ORDER_STATUS: OrderStatusInfo[] = [
  { label: "Placed", value: "placed", progressValue: 0 },
  { label: "Confirmed", value: "confirmed", progressValue: 25 },
  { label: "Paid", value: "paid", progressValue: 50 },
  { label: "In Progress", value: "inProgress", progressValue: 75 },
  { label: "Out for Delivery", value: "outForDelivery", progressValue: 90 },
  { label: "Delivered", value: "delivered", progressValue: 100 },
  { label: "Rejected", value: "rejected", progressValue: 0 },
];
