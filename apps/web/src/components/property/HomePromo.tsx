'use client';
import React, { useEffect, useState } from 'react';
import { RiDiscountPercentFill } from 'react-icons/ri';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, useDotButton } from './carousel/EmblaCarouselDotButton';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './carousel/EmblaCarouselArrowButton';

const images = [
  'https://i.imgur.com/qohRJ8L.png',
  'https://i.imgur.com/8e3wjSo.png',
];

const carouselOptions = { loop: true };

function HomePromo() {
  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setPrevBtnEnabled(emblaApi.canScrollPrev());
      setNextBtnEnabled(emblaApi.canScrollNext());
    };

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="mx-auto tracking-tighter mt-10 max-w-screen-lg px-10 lg:px-0">
      <div className="flex flex-col gap-3">
        <div className="flex text-2xl items-center gap-2">
          <div>
            <RiDiscountPercentFill />
          </div>
          <div className="font-semibold">Special offers for you</div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {images.map((src, index) => (
              <div className="embla__slide" key={index}>
                <img
                  src={src}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ))}
          </div>

          {emblaApi && (
            <>
              <PrevButton
                enabled={prevBtnEnabled}
                onClick={() => emblaApi.scrollPrev()}
              />
              <NextButton
                enabled={nextBtnEnabled}
                onClick={() => emblaApi.scrollNext()}
              />

              <div className="embla__dots">
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    selected={index === selectedIndex}
                    onClick={() => emblaApi.scrollTo(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePromo;
