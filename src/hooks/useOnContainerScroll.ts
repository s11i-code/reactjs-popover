import { useEffect } from "react";

export function useOnContainerScroll(
  func: (e: Event, scrolledElement: HTMLElement) => void,
  child: HTMLElement | null | undefined
) {
  useEffect(() => {
    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (child && target.contains(child)) {
        func(e, target);
      }
    };

    window.addEventListener("scroll", onScroll, true); 

    return () => {
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [child, func]) }