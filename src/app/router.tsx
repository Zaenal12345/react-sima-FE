import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../guards/ProtectedRoute";
import Categories from "../pages/product-management/Categories";
import Merks from "../pages/product-management/Merks";
import Suppliers from "../pages/product-management/Suppliers";
import Customers from "../pages/product-management/Customers";
import Products from "../pages/product-management/Products";
import Users from "../pages/user-management/Users";
import Roles from "../pages/user-management/Roles";
import Permissions from "../pages/user-management/Permissions";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "product-management/categories",
        element: <Categories />,
      },
      {
        path: "product-management/brands",
        element: <Merks />,
      },
      {
        path: "product-management/suppliers",
        element: <Suppliers />,
      },
      {
        path: "product-management/customers",
        element: <Customers />,
      },
      {
        path: "product-management/products",
        element: <Products />,
      },
      {
        path: "user-management/users",
        element: <Users />,
      },
      {
        path: "user-management/roles",
        element: <Roles />,
      },
      {
        path: "user-management/permissions",
        element: <Permissions />,
      },
    ],
  },
]);