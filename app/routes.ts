import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("intro_page", "routes/intro_page.tsx"),
    route("draw_gift", "routes/draw_gift.tsx"),
    route("ar_camera", "routes/ar_camera.tsx"),
] satisfies RouteConfig;
