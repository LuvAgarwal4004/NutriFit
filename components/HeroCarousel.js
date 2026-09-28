"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { images } from "@/components/util";
import SmartLink from "./SmartLink";

// images[0] = banner.jpeg  -> desktop
// images[1] = banner1.jpeg -> phone
const toSrc = (path) => (path.startsWith("/") ? path : `/${path}`);
const DESKTOP_SRC = toSrc(images[0]);
const MOBILE_SRC = toSrc(images[1]);

// Must match the `md` breakpoint in Tailwind (768px)
const DESKTOP_MEDIA = "(min-width: 768px)";

export default function HeroCarousel() {
    const imgRef = useRef(null);

    // Banner shape starts at a sensible default, then locks to the
    // real image's own aspect ratio once it loads.
    const [heroRatio, setHeroRatio] = useState(2.3);

    const updateRatio = (img) => {
        if (img?.naturalWidth && img?.naturalHeight) {
            setHeroRatio(img.naturalWidth / img.naturalHeight);
        }
    };

    // Covers the case where the image finished loading before React hydrated
    useEffect(() => {
        if (imgRef.current?.complete) {
            updateRatio(imgRef.current);
        }
    }, []);

    const common = {
        alt: "Featured collection",
        fill: true,
        quality: 75,
        sizes: "(max-width: 768px) 100vw, 1200px",
    };

    const {
        props: { srcSet: desktopSrcSet },
    } = getImageProps({ ...common, src: DESKTOP_SRC });

    const {
        props: { srcSet: _mobileSrcSet, ...imgProps },
    } = getImageProps({ ...common, src: MOBILE_SRC });

    return (
        <div
            className="group relative mx-auto w-[92%] max-w-6xl 
            overflow-hidden max-h-[70vh]
             md:max-h-[420px] lg:max-h-[520px]"
            style={{ aspectRatio: heroRatio }}
        >
            <SmartLink href="/game">
                <picture>
                    {/* Desktop / tablet */}
                    <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} />

                    {/* Phone (default) */}
                    <img
                        {...imgProps}
                        ref={imgRef}
                        className="object-cover"
                        onLoad={(e) => updateRatio(e.currentTarget)}
                        fetchPriority="high"
                    />
                </picture>
            </SmartLink>
        </div>
    );
}