import { CircleXIcon } from "lucide-react";
import { type InputHTMLAttributes, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type DebouncedInputProps = {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  isSearchInput?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

export function DebouncedInputText({
  value: initialValue,
  onChange,
  debounce = 300,
  isSearchInput = false,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
      <Input
        {...props}
        value={value}
        onChange={(e) => {
          if (e.target.value === "") return setValue("");
          setValue(e.target.value);
        }}
      />
  );
}
