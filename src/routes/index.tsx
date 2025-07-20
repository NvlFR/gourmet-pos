// src/routes/index.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { Heading } from "@chakra-ui/react";
import InventoryPage from "../features/inventory/pages/InventoryPage"; // Import baru
import ProdukPage from "../features/menu/pages/ProdukPage";
import PosPage from "../features/pos/pages/PosPage";
import SupplierPage from "../features/procurement/pages/SupplierPage";
import PurchaseOrderListPage from "../features/procurement/pages/PurchaseOrderListPage";
import CreatePurchaseOrderPage from "../features/procurement/pages/CreatePurchaseOrderPage";
import PurchaseOrderDetailPage from "../features/procurement/pages/PurchaseOrderDetailPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
// Halaman Dummy lainnya
const DashboardPage = () => <Heading>Dashboard</Heading>;
// ...

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        {/* ... rute lain */}
        <Route path="inventory" element={<InventoryPage />} />{" "}
        <Route path="menu" element={<ProdukPage />} />
        <Route path="pos" element={<PosPage />} />
        <Route path="procurement" element={<PurchaseOrderListPage />} />
        <Route path="procurement/suppliers" element={<SupplierPage />} />
        <Route path="/procurement/new" element={<CreatePurchaseOrderPage />} />
        <Route path="/procurement/:id" element={<PurchaseOrderDetailPage />} />
        {/* Menggunakan komponen asli */}
        {/* ... rute lain */}
      </Route>
      {/* ... */}
    </Routes>
  );
};
