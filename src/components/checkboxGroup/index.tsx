"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

// import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@material-tailwind/react";

type Checked = DropdownMenuCheckboxItemProps["checked"];
interface CheckboxGroupProps {
  label?: string;
  placeholder?: string;
  children: React.ReactNode;
  options: { id: number | string; label: string }[];
  value: { id: number | string; label: string }[];
  onChange: (value: { id: number | string; label: string }) => void;
}

export function CheckboxGroup({
  // label,
  // placeholder,
  children,
  options,
  value,
  onChange,
}: CheckboxGroupProps) {
  //   const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  //   const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  //   const [showPanel, setShowPanel] = React.useState<Checked>(false);
  const [optionsChecked, setOptionsChecked] = React.useState<{
    [key: number]: Checked;
  }>(value?.reduce((acc, option) => ({ ...acc, [option.id]: true }), {}));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="col-span-2">
        <Button
          placeholder="Toogle multiselector"
          className="bg-none! text-gray-700 border border-blue-gray-200 shadow-none w-full hover:shadow-none cursor-default"
        >
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((option) => (
          <>
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={optionsChecked[option.id]}
              onCheckedChange={(checked) => {
                setOptionsChecked((prev) => ({
                  ...prev,
                  [option.id]: checked,
                }));
                onChange({ id: option.id, label: option.label });
              }}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
