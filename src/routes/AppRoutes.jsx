import { Routes, Route, useLocation } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import ErrorBoundary from "../components/ErrorBoundory";
import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeesPage from "@/pages/Employees";
import PayrollPage from "@/pages/Payroll";
import LeavePage from "@/pages/Leaves";
import ABACPage from "@/pages/RBAC";
import KitchenOrdersPage from "@/pages/KitchenOrders";
import OrdersPage from "@/pages/Orders";
import TablesPage from "@/pages/Tables";
import BillingPage from "@/pages/Billing";
import ProfilePage from "@/pages/MyProfile";
import OutletsPage from "@/pages/Outlets";
import CustomersPage from "@/pages/Customers";
import BrandsPage from "@/pages/Brands";
import StaffPage from "@/pages/Staff";
import AddProductPage from "@/pages/AddProduct";
import ProductsPage from "@/pages/Products";
import CategoriesPage from "@/pages/Categories";
import AddOnsPage from "@/pages/AddOns";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />


        <Route
          path="/menu/products/new"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AddProductPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/categories"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <CategoriesPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/products"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <ProductsPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/addons"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AddOnsPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <OrdersPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          // path="/kitchen-orders"
          path="/kot"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <KitchenOrdersPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tables"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <TablesPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <BillingPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/brands"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <BrandsPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/outlets"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <OutletsPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <StaffPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <CustomersPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <ProfilePage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="/rbac"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <ABACPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ErrorBoundary>
              <NotFound />
            </ErrorBoundary>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;


