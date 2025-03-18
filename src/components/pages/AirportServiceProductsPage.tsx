import React from "react";
import AirportServiceProductManagement from "@/components/inventory/AirportServiceProductManagement";
import Sidebar from "@/components/layout/Sidebar";

const AirportServiceProductsPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-auto">
        <AirportServiceProductManagement />
      </div>
    </div>
  );
};

export default AirportServiceProductsPage;
