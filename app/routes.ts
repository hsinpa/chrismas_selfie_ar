import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("ar_camera", "routes/ar_camera.tsx"),
    route("draw_gift", "routes/draw_gift.tsx"),
] satisfies RouteConfig;
