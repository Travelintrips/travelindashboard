import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import DataEntryPage from "./components/pages/DataEntryPage";
import RoleManagementPage from "./components/pages/RoleManagementPage";
import UserManagementPage from "./components/pages/UserManagementPage";
import AccountingDashboard from "./components/accounting/AccountingDashboard";
import GeneralLedger from "./components/accounting/GeneralLedger";
import TransactionEntry from "./components/accounting/TransactionEntry";
import FinancialReports from "./components/accounting/FinancialReports";
import ChartOfAccounts from "./components/accounting/ChartOfAccounts";
import SalesDashboard from "./components/sales/SalesDashboard";
import SalesTransactionEntry from "./components/sales/SalesTransactionEntry";
import SalesReports from "./components/sales/SalesReports";
import IntegrationDashboard from "./components/integration/IntegrationDashboard";
import InventoryDashboard from "./components/inventory/InventoryDashboard";
import InventoryTransactionEntry from "./components/inventory/InventoryTransactionEntry";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import UnauthorizedPage from "./components/pages/UnauthorizedPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import routes from "tempo-routes";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Memuat...</p>} className="relative">
        <>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-entry"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DataEntryPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/role-management"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <RoleManagementPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <UserManagementPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Accounting System Routes */}
            <Route
              path="/accounting"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AccountingDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/general-ledger"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <GeneralLedger />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaction-entry"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manajer", "Staf"]}>
                  <MainLayout>
                    <TransactionEntry />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/financial-reports"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <FinancialReports />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chart-of-accounts"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manajer"]}>
                  <MainLayout>
                    <ChartOfAccounts />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Sales Reporting Routes */}
            <Route
              path="/sales-dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SalesDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-transaction-entry"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manajer", "Staf"]}>
                  <MainLayout>
                    <SalesTransactionEntry />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-reports"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SalesReports />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Integration Route */}
            <Route
              path="/integration"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manajer"]}>
                  <MainLayout>
                    <IntegrationDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Inventory Routes */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <InventoryDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory-dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <InventoryDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory-transaction-entry"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Manajer", "Staf"]}>
                  <MainLayout>
                    <InventoryTransactionEntry />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" element={null} />
            )}
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
