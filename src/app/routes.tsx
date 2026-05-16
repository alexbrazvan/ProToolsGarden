import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { ProductPage } from "./pages/ProductPage";
import { Cart } from "./pages/Cart";
import { Login } from "./pages/Login";
import { PowerTools } from "./pages/PowerTools";
import { GardenTools } from "./pages/GardenTools";
import { ConstructionEquipment } from "./pages/ConstructionEquipment";
import { Accessories } from "./pages/Accessories";
import { Promotions } from "./pages/Promotions";
import { Account } from "./pages/Account";
import { Wishlist } from "./pages/Wishlist";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderSuccess } from "./pages/OrderSuccess";



export const router = createBrowserRouter([
  {
    path: "/",
    element: (
  <AuthProvider>
    <CartProvider>    {/* ← învelește Layout cu CartProvider */}
      <Layout />
    </CartProvider>
  </AuthProvider>
),
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductPage },
      { path: "cart", Component: Cart },
      { path: "login", Component: Login },
      { path: "wishlist", Component: Wishlist },
      { path: "power-tools", Component: PowerTools },
      { path: "garden-tools", Component: GardenTools },
      { path: "construction-equipment", Component: ConstructionEquipment },
      { path: "accessories", Component: Accessories },
      { path: "promotions", Component: Promotions },
      { path: "*", Component: Home },
      { path: "order-success", Component: OrderSuccess },
      {
        Component: ProtectedRoute,
        children: [
          { path: "account", Component: Account },
        ],
      },
    ],
  },
]);