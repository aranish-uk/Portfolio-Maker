import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Portfolio Maker",
        short_name: "Portfolio",
        description: "Transform your resume into a stunning portfolio website.",
        start_url: "/",
        display: "standalone",
        background_color: "#020617",
        theme_color: "#6366f1",
        icons: [
            {
                src: "/icon.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
