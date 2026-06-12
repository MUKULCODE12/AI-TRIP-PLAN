"use client";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}

type CardType = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

/* -------------------------------------------------------------------------- */
/*                                 CONTEXT                                    */
/* -------------------------------------------------------------------------- */

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

/* -------------------------------------------------------------------------- */
/*                                 CAROUSEL                                   */
/* -------------------------------------------------------------------------- */

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

  const handleCardClose = (index: number) => {
    if (!carouselRef.current) return;
    const cardWidth = isMobile() ? 230 : 384;
    const gap = isMobile() ? 4 : 8;
    carouselRef.current.scrollTo({
      left: (cardWidth + gap) * (index + 1),
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex w-full overflow-x-scroll scroll-smooth py-10 md:py-20 [scrollbar-width:none]"
        >
          <div className="flex gap-4 pl-4 mx-auto max-w-7xl">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="rounded-3xl last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mr-10 flex justify-end gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   CARD                                     */
/* -------------------------------------------------------------------------- */

export const Card = ({
  card,
  index,
}: {
  card: CardType;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useOutsideClick(containerRef, () => setOpen(false));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50">
            <motion.div
              className="fixed inset-0 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              ref={containerRef}
              className="relative z-50 mx-auto my-10 max-w-5xl rounded-3xl bg-white p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => {
                  setOpen(false);
                  onCardClose(index);
                }}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black"
              >
                <IconX className="h-5 w-5 text-white" />
              </button>

              <p className="mt-4 text-sm font-medium">{card.category}</p>
              <h2 className="mt-2 text-3xl font-bold">{card.title}</h2>
              <div className="mt-6">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(true)}
        className="relative flex h-80 w-56 overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96"
      >
        <div className="absolute inset-0 z-30 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative z-40 p-8 text-white">
          <p className="text-sm font-medium">{card.category}</p>
          <h3 className="mt-2 text-xl font-semibold">{card.title}</h3>
        </div>

        <BlurImage
          src={card.src}
          alt={card.title}
          className="absolute inset-0 z-10"
        />
      </motion.button>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 IMAGE                                      */
/* -------------------------------------------------------------------------- */

export const BlurImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      quality={100}
      sizes="(max-width: 768px) 90vw, 384px"
      className={cn("object-cover", className)}
    />
  );
};
