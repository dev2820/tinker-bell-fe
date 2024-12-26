import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./pages/Home.tsx"),
  route("experience", "./pages/Experience.tsx"),
  route("login", "./pages/Login.tsx"),
  route("setting", "./pages/Setting.tsx"),
] satisfies RouteConfig;
