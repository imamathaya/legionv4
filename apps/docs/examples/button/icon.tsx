"use client";

import { Button } from "@legionv4/ui";
import { Search } from "lucide-react";

export function IconExample() {
  return (
    <Button className="size-9 px-0" aria-label="Search">
      <Search aria-hidden="true" className="size-4 shrink-0" />
    </Button>
  );
}
