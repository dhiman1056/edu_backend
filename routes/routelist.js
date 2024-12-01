import authRoute from "./authRoute.js";
import orderRoutes from "./orderRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import productRoutes from "./productRoutes.js";
import profileRoutes from "./profileRoute.js";
import cartRoutes from "./cartRoute.js";

// API routes
const routelist = [
  { path: "/api/auth", route: authRoute },
  { path: "/api/workspace", route: workspaceRoutes },
  { path: "/api/profile", route: profileRoutes },
  { path: "/api/products", route: productRoutes },
  { path: "/api/order", route: orderRoutes },
  { path: "/api/cart", route: cartRoutes },
];

export default routelist;
