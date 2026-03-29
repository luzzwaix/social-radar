import { useEffect, useMemo, useState } from "react";

export function useTypewriter(input, speed = 16) {
  const content = useMemo(() => {
    if (Array.isArray(input)) {
      return input.filter(Boolean).join(" ");
    }

    return input ?? "";
  }, [input]);

  const [text, setText] = useState("");

  useEffect(() => {
    setText("");

    if (!content) {
      return undefined;
    }

    let index = 0;
    const timeout = window.setInterval(() => {
      index += 1;
      setText(content.slice(0, index));

      if (index >= content.length) {
        window.clearInterval(timeout);
      }
    }, speed);

    return () => window.clearInterval(timeout);
  }, [content, speed]);

  return text;
}

export default useTypewriter;
