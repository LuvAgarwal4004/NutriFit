"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { images } from "@/components/util";
import SmartLink from "./SmartLink";

/* =========================================================
   BANNER SETTINGS  (edit only this part to add your images)
   Put your image files in /public and change the paths below.
   - desktop = shown on screens 768px and wider
   - mobile  = shown on phones
   - ratio   = fallback shape before the image loads
               (it locks to the real image's shape after load)
   - zoom    = 1 is normal. If your image has empty/white space
               baked into its edges, raise it (1.05, 1.1, 1.15...)
               to crop that space out.
========================================================= */

const toSrc = (path) => (path.startsWith("/") ? path : `/${path}`);

const TOP_BANNER = {
    desktop: toSrc(images[0]), // PLACEHOLDER: replace with your top banner (desktop)
    mobile: toSrc(images[1]), // PLACEHOLDER: replace with your top banner (phone)
    href: "/gamenologin",
    alt: "Smarter fitness. Better nutrition.",
    ratio: 4.5, // wide banner, like your screenshot
    zoom: 1,
    label: "TOP BANNER IMAGE",
};

const BOTTOM_BANNER = {
    desktop: "/bannerdesktop.jpg", // PLACEHOLDER: replace with your bottom banner (desktop)
    mobile: "/bannerdesktop.jpg", // PLACEHOLDER: replace with your bottom banner (phone)
    href: "/market",
    alt: "Play and win free fuel",
    ratio: 6.3, // slimmer banner, like your screenshot
    zoom: 1,
    label: "BOTTOM BANNER IMAGE",
};

// Set to false if you want to remove the 4-item strip between the banners
const SHOW_FEATURE_STRIP = false;

const FEATURES = [
    { icon: "✦", title: "AI Coach & Nutritionist", text: "Personalized guidance" },
    { icon: "◒", title: "Affordable Products", text: "Quality nutrition at great prices" },
    { icon: "↗", title: "Track Your Progress", text: "Plans, workouts & more" },
    { icon: "◇", title: "Fun Challenges", text: "Play & win rewards" },
];

// Must match the `md` breakpoint in Tailwind (768px)
const DESKTOP_MEDIA = "(min-width: 768px)";

/* =========================================================
   Single banner (desktop image + phone image)
========================================================= */

function Banner({ desktop, mobile, href, alt, ratio, zoom = 1, label, priority }) {
    const imgRef = useRef(null);
    const [heroRatio, setHeroRatio] = useState(ratio);
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const updateRatio = (img) => {
        if (img?.naturalWidth && img?.naturalHeight) {
            setHeroRatio(img.naturalWidth / img.naturalHeight);
            setLoaded(true);
        }
    };

    // Covers the case where the image finished loading before React hydrated
    useEffect(() => {
        if (imgRef.current?.complete) {
            updateRatio(imgRef.current);
        }
    }, []);

    const common = {
        alt,
        fill: true,
        quality: 75,
        sizes: "(max-width: 768px) 100vw, 1200px",
    };

    const {
        props: { srcSet: desktopSrcSet },
    } = getImageProps({ ...common, src: desktop });

    const {
        props: { srcSet: _mobileSrcSet, ...imgProps },
    } = getImageProps({ ...common, src: mobile });

    return (
        <div
            className={`relative block w-full overflow-hidden rounded-2xl ${
                loaded ? "" : "bg-[#e3f0e8]"
            }`}
            style={{ aspectRatio: heroRatio }}
        >
            {/* Placeholder (only visible until your image loads) */}
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-[#b9d9c7] text-xs font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
                    {label}
                </div>
            )}

            <SmartLink href={href}>
                {!failed && (
                    <picture>
                        {/* Desktop / tablet */}
                        <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} />

                        {/* Phone (default) */}
                        <img
                            {...imgProps}
                            ref={imgRef}
                            className="object-cover"
                            style={{
                                ...(imgProps.style || {}),
                                transform: `scale(${zoom})`,
                            }}
                            onLoad={(e) => updateRatio(e.currentTarget)}
                            onError={() => setFailed(true)}
                            fetchPriority={priority ? "high" : "auto"}
                        />
                    </picture>
                )}
            </SmartLink>
        </div>
    );
}

/* =========================================================
   Hero carousel: bottom banner, top banner, feature strip
   (kept in the same order as your current file)
========================================================= */

export default function HeroCarousel() {
    return (
        <section className="mx-auto flex w-[92%] max-w-6xl flex-col gap-0">
            {/* BOTTOM BANNER */}
            <Banner
                desktop={BOTTOM_BANNER.desktop}
                mobile={BOTTOM_BANNER.mobile}
                href={BOTTOM_BANNER.href}
                alt={BOTTOM_BANNER.alt}
                ratio={BOTTOM_BANNER.ratio}
                zoom={BOTTOM_BANNER.zoom}
                label={BOTTOM_BANNER.label}
            />

            {/* TOP BANNER */}
            <Banner
                desktop={TOP_BANNER.desktop}
                mobile={TOP_BANNER.mobile}
                href={TOP_BANNER.href}
                alt={TOP_BANNER.alt}
                ratio={TOP_BANNER.ratio}
                zoom={TOP_BANNER.zoom}
                label={TOP_BANNER.label}
                priority
            />

            {/* FEATURE STRIP */}
            {SHOW_FEATURE_STRIP && (
                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 rounded-2xl bg-[#e9f3ed] p-4 md:grid-cols-4 md:gap-0 md:p-5">
                    {FEATURES.map((f, i) => (
                        <div
                            key={f.title}
                            className={`flex items-center gap-3 md:px-4 ${
                                i > 0 ? "md:border-l md:border-[#cfe0d7]" : ""
                            }`}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d7eadf] text-lg text-[#245543] md:h-11 md:w-11">
                                {f.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#173d30] sm:text-xs">
                                    {f.title}
                                </p>
                                <p className="mt-0.5 text-[10px] text-[#5f7a6d] sm:text-[11px]">
                                    {f.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}