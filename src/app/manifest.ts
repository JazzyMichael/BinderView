import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Binder View",
    short_name: "Binder View",
    description:
      "From Vintage to Modern, and everything in-between, BinderView provides the best digital binder experience for viewing pokemon cards.",
    start_url: "/",
    // display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
