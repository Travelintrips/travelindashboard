import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileInput,
  Users,
  UserCog,
  Calculator,
  FileText,
  BarChart3,
  LineChart,
  ShoppingCart,
  Layers,
  Settings,
  ArrowRightLeft,
  Plane,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dasbor",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/",
    },
    {
      title: "Entri Data",
      icon: <FileInput className="h-5 w-5" />,
      path: "/data-entry",
    },
    {
      title: "Manajemen Pengguna",
      icon: <Users className="h-5 w-5" />,
      path: "/user-management",
    },
    {
      title: "Manajemen Peran",
      icon: <UserCog className="h-5 w-5" />,
      path: "/role-management",
    },
    {
      title: "Akuntansi",
      icon: <Calculator className="h-5 w-5" />,
      path: "/accounting",
      subItems: [
        {
          title: "Buku Besar",
          path: "/general-ledger",
        },
        {
          title: "Entri Transaksi",
          path: "/transaction-entry",
        },
        {
          title: "Laporan Keuangan",
          path: "/financial-reports",
        },
        {
          title: "Bagan Akun",
          path: "/chart-of-accounts",
        },
      ],
    },
    {
      title: "Penjualan",
      icon: <ShoppingCart className="h-5 w-5" />,
      path: "/sales-dashboard",
      subItems: [
        {
          title: "Dasbor Penjualan",
          path: "/sales-dashboard",
        },
        {
          title: "Entri Transaksi",
          path: "/sales-transaction-entry",
        },
        {
          title: "Laporan Penjualan",
          path: "/sales-reports",
        },
      ],
    },
    {
      title: "Inventaris",
      icon: <Layers className="h-5 w-5" />,
      path: "/inventory-dashboard",
      subItems: [
        {
          title: "Dasbor Inventaris",
          path: "/inventory-dashboard",
        },
        {
          title: "Entri Transaksi",
          path: "/inventory-transaction-entry",
        },
        {
          title: "Produk Layanan Bandara",
          path: "/airport-service-products",
        },
      ],
    },
    {
      title: "Integrasi",
      icon: <ArrowRightLeft className="h-5 w-5" />,
      path: "/integration",
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-10">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Sistem Akuntansi</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isParentOfActive =
              hasSubItems &&
              item.subItems?.some(
                (subItem) => location.pathname === subItem.path,
              );

            return (
              <div key={index} className="mb-2">
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                    isActive || isParentOfActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>

                {hasSubItems && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem, subIndex) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                            isSubActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50",
                          )}
                        >
                          <span className="truncate">{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8 rounded-full"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="User avatar"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <Link
              to="/settings"
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              <div className="flex items-center">
                <Settings className="h-3 w-3 mr-1" />
                Pengaturan
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
