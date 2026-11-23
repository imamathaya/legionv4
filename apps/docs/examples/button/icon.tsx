import { Button } from "@legionv4/ui";
import { Search } from "lucide-react";

export function ButtonIconExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm" className="size-8" aria-label="Search">
        <Search aria-hidden="true" />
      </Button>
      <Button>
        <Search aria-hidden="true" />
        Search
      </Button>
    </div>
  );
}
