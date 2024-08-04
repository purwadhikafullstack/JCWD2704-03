// EmblaCarouselDotButton.tsx
import React from 'react';
import clsx from 'clsx';

type DotButtonProps = {
  selected: boolean;
  onClick: () => void;
};

export const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
  <button
    className={clsx('embla__dot', { 'is-selected': selected })}
    type="button"
    onClick={onClick}
  />
);

export const useDotButton = (embla: any) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!embla) return;
    setScrollSnaps(embla.scrollSnapList());

    const onSelect = () => {
      setSelectedIndex(embla.selectedScrollSnap());
    };
    embla.on('select', onSelect);
    onSelect();
  }, [embla]);

  return { selectedIndex, scrollSnaps };
};
