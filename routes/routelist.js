import productCartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import orgRoutes from "./orgRoutes.js";
import productRoutes from "./productRoutes.js";
import profileRoutes from "./profileRoute.js";
import authRoute from "./authRoute.js";

// API routes
const routelist = [
  { path: "/api/auth", route: authRoute },
  { path: "/api/org", route: orgRoutes },
  { path: "/api/profile", route: profileRoutes },
  { path: "/api/products", route: productRoutes },
  { path: "/api/cart", route: productCartRoutes },
  { path: "/api/order", route: orderRoutes },
];

export default routelist;
