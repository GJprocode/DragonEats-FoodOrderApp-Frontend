// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\PriceDeliveryComponent.tsx

import React from "react";

type DeliveryTableProps = {
  type: "restaurant" | "wholesale";
  deliveryData: {
    distance: string;
    time: string;
    price: string;
  }[];
};

const PriceDeliveryComponent: React.FC<DeliveryTableProps> = ({ type, deliveryData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">
        {type === "restaurant" ? "Restaurant Delivery Table" : "Wholesale Delivery Table"}
      </h3>
      <p className="text-sm text-gray-500">
        These prices and times are calculated dynamically and managed by Dragon Eats. Wholesale prices are 
        refunded based on 3de party logistics prices and size of order.
      </p>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Distance</th>
            <th className="border border-gray-300 px-4 py-2">Delivery Time</th>
            <th className="border border-gray-300 px-4 py-2">Delivery Fee</th>
          </tr>
        </thead>
        <tbody>
          {deliveryData.map((row, index) => (
            <tr key={index} className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 text-gray-600">{row.distance}</td>
              <td className="border border-gray-300 px-4 py-2 text-gray-600">{row.time}</td>
              <td className="border border-gray-300 px-4 py-2 text-gray-600">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceDeliveryComponent;
