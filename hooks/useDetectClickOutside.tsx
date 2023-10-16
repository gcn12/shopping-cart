import React, { useEffect } from "react";

type Props = {
  ref: React.RefObject<HTMLElement>;
  callback: (...args: any) => any;
};

export default function useDetectClickOutside({ ref, callback }: Props) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
