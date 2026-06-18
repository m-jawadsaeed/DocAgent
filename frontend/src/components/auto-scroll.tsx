import { useEffect, useRef } from "react";

export function AutoScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,

      behavior: "smooth",
    });
  }, [children]);

  return (
    <div
      ref={ref}
      className="
      overflow-y-auto
      h-full
      "
    >
      {children}
    </div>
  );
}