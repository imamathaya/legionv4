"use client";

import { Button } from "@legionv4/ui";

export function LoadingExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button loading loadingLabel="Saving">
        Save
      </Button>
      <Button variant="destructive" loading loadingLabel="Deleting">
        Delete
      </Button>
    </div>
  );
}
