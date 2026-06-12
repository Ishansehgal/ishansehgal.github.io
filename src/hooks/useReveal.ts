import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref and toggles the
 * `active` class on every `.reveal` / `.reveal-line` descendant when it
 * enters the viewport. Stagger via `--reveal-delay` inline style.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = ref.current?.querySelectorAll(".reveal, .reveal-line");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
};
