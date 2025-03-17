import React from "react";
import DataEntryForm from "../dashboard/DataEntryForm";
import DashboardHeader from "../dashboard/DashboardHeader";

interface DataEntryPageProps {
  userName?: string;
  userAvatar?: string;
}

const DataEntryPage = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: DataEntryPageProps) => {
  const handleNewTransaction = (data: any) => {
    console.log("New transaction submitted:", data);
    // In a real app, this would save the transaction to a database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Formulir Entri Data"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <DataEntryForm onSubmit={handleNewTransaction} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Sistem Pemesanan Perjalanan.
              Seluruh hak cipta dilindungi.
            </p>
            <p className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataEntryPage;
