// import { Routes, Route, useLocation } from "react-router-dom";
// import { lazy } from "react";
// import MainLayout from "../layouts/MainLayout";
// import ErrorBoundary from "../components/ErrorBoundory";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import ABACPage from "@/pages/RBAC";
// import KitchenOrdersPage from "@/pages/KitchenOrders";
// import OrdersPage from "@/pages/Orders";
// import TablesPage from "@/pages/Tables";
// import BillingPage from "@/pages/Billing";
// import ProfilePage from "@/pages/MyProfile";
// import OutletsPage from "@/pages/Outlets";
// import CustomersPage from "@/pages/Customers";
// import BrandsPage from "@/pages/Brands";
// import StaffPage from "@/pages/Staff";
// import AddProductPage from "@/pages/AddProduct";
// import ProductsPage from "@/pages/Products";
// import CategoriesPage from "@/pages/Categories";
// import AddOnsPage from "@/pages/AddOns";
// import RoleBasedLogin from "@/pages/Login";
// import ResetPasswordPage from "@/pages/ResetPassword";
// import ForgotPasswordPage from "@/pages/ForgotPassword";

// // Lazy-loaded pages
// const Home = lazy(() => import("../pages/Home"));
// const NotFound = lazy(() => import("../pages/NotFound"));

// const AppRoutes = () => {
//   const location = useLocation();

//   return (
//     <Routes location={location} key={location.pathname}>
//       <Route
//         path="/login"
//         element={
//           <ProtectedRoute>
//             <ErrorBoundary>
//               <RoleBasedLogin />
//             </ErrorBoundary>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/forgot-password"
//         element={
//           <ProtectedRoute>
//             <ErrorBoundary>
//               <ForgotPasswordPage />
//             </ErrorBoundary>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/reset-password"
//         element={
//           <ProtectedRoute>
//             <ErrorBoundary>
//               <ResetPasswordPage />
//             </ErrorBoundary>
//           </ProtectedRoute>
//         }
//       />

//       <Route path="/" element={<MainLayout />}>
//         <Route
//           index
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <Home />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/menu/products/new"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <AddProductPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/menu/categories"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <CategoriesPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/menu/products"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <ProductsPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/menu/addons"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <AddOnsPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/orders"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <OrdersPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           // path="/kitchen-orders"
//           path="/kot"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <KitchenOrdersPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/tables"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <TablesPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/billing"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <BillingPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/brands"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <BrandsPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/outlets"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <OutletsPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/staff"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <StaffPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/customers"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <CustomersPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <ProfilePage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/rbac"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <ABACPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="*"
//           element={
//             <ErrorBoundary>
//               <NotFound />
//             </ErrorBoundary>
//           }
//         />
//       </Route>
//     </Routes>
//   );
// };

// export default AppRoutes;



















import { Routes, Route, useLocation } from "react-router-dom";
import { lazy } from "react";

import MainLayout from "../layouts/MainLayout";
import ErrorBoundary from "../components/ErrorBoundory";
import ProtectedRoute from "@/components/ProtectedRoute";

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

import RoleBasedLogin from "@/pages/Login";
import ResetPasswordPage from "@/pages/ResetPassword";
import ForgotPasswordPage from "@/pages/ForgotPassword";

// Lazy pages
const Home = lazy(() => import("../pages/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>

      {/* -------- PUBLIC ROUTES -------- */}
      <Route
        path="/login"
        element={
          <ErrorBoundary>
            <RoleBasedLogin />
          </ErrorBoundary>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <ErrorBoundary>
            <ForgotPasswordPage />
          </ErrorBoundary>
        }
      />

      <Route
        path="/reset-password"
        element={
          <ErrorBoundary>
            <ResetPasswordPage />
          </ErrorBoundary>
        }
      />


      {/* -------- PROTECTED ROUTES (Require Login) -------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          }
        />

        <Route
          path="menu/products/new"
          element={
            <ErrorBoundary>
              <AddProductPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="menu/categories"
          element={
            <ErrorBoundary>
              <CategoriesPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="menu/products"
          element={
            <ErrorBoundary>
              <ProductsPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="menu/addons"
          element={
            <ErrorBoundary>
              <AddOnsPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="orders"
          element={
            <ErrorBoundary>
              <OrdersPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="kot"
          element={
            <ErrorBoundary>
              <KitchenOrdersPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="tables"
          element={
            <ErrorBoundary>
              <TablesPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="billing"
          element={
            <ErrorBoundary>
              <BillingPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="companies"
          element={
            <ErrorBoundary>
              <BrandsPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="outlets"
          element={
            <ErrorBoundary>
              <OutletsPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="staff"
          element={
            <ErrorBoundary>
              <StaffPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="customers"
          element={
            <ErrorBoundary>
              <CustomersPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="profile"
          element={
            <ErrorBoundary>
              <ProfilePage />
            </ErrorBoundary>
          }
        />

        <Route
          path="rbac"
          element={
            <ErrorBoundary>
              <ABACPage />
            </ErrorBoundary>
          }
        />

        {/* NOT FOUND INSIDE PROTECTED ROUTES */}
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
