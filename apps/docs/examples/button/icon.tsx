"use client";

import { Button } from "@legionv4/ui";
import { Search } from "lucide-react";

export function IconExample() {
  return (
    <Button className="size-9" aria-label="Search">
      <Search aria-hidden="true" />
    </Button>
  );
}
