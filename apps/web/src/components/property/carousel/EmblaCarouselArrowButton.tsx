// EmblaCarouselArrowButtons.tsx
import React from 'react';

type ButtonProps = {
  enabled: boolean;
  onClick: () => void;
};

export const PrevButton: React.FC<ButtonProps> = ({ enabled, onClick }) => (
  <button
    className="embla__button embla__button--prev"
    onClick={onClick}
    disabled={!enabled}
  >
    {'<'}
  </button>
);

export const NextButton: React.FC<ButtonProps> = ({ enabled, onClick }) => (
  <button
    className="embla__button embla__button--next"
    onClick={onClick}
    disabled={!enabled}
  >
    {'>'}
  </button>
);

export const usePrevNextButtons = (embla: any) => {
  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!embla) return;

    const onSelect = () => {
      setPrevBtnEnabled(embla.canScrollPrev());
      setNextBtnEnabled(embla.canScrollNext());
    };
    embla.on('select', onSelect);
    onSelect();
  }, [embla]);

  return { prevBtnEnabled, nextBtnEnabled };
};
