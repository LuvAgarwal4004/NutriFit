"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { images } from "@/components/util";

export default function HeroCarousel() {

    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);
    const touchStart = useRef(0);

    // Banner shape starts at a sensible default, then locks to the
    // real image's own aspect ratio once it loads.
    const [heroRatio, setHeroRatio] = useState(2.3);

    const handleHeroImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        if (naturalWidth && naturalHeight) {
            setHeroRatio(naturalWidth / naturalHeight);
        }
    };

    const next = () =>
        setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    const prev = () =>
        setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

    useEffect(() => {
        timeoutRef.current = setTimeout(next, 3000);
        return () => clearTimeout(timeoutRef.current);
    }, [index]);

    const onTouchStart = (e) => (touchStart.current = e.touches[0].clientX);
    const onTouchEnd = (e) => {
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (diff > 50) next();
        if (diff < -50) prev();
    };

    return (
        <div
            className="group relative mx-auto w-[88%] max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4169e1] to-[#1e3a8a] shadow-2xl shadow-blue-500/30 ring-1 ring-black/5 max-h-[220px]
sm:max-h-[320px]
md:max-h-[420px]
lg:max-h-[520px]"
            style={{ aspectRatio: heroRatio }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {images.map((src, i) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === index ?
                        "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={src}
                        alt={`Featured collection ${i + 1}`}
                        fill
                        priority={i === 0}
                        quality={75}
                        sizes="(max-width: 768px) 100vw, 1200px"
                        className="object-cover"
                        onLoad={i === 0 ? handleHeroImageLoad : undefined}
                    />
                </div>
            ))}

            {/* gradient overlay for depth */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

            {/* arrows */}
            <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white/30 group-hover:opacity-100 sm:left-6 sm:h-12 sm:w-12"
            >
                ❮
            </button>
            <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white/30 group-hover:opacity-100 sm:right-6 sm:h-12 sm:w-12"
            >
                ❯
            </button>

            {/* dots */}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}