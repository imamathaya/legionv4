import { Button } from "@legionv4/ui";

export function ButtonLoadingExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading loadingLabel="Saving">
        Saving
      </Button>
      <Button variant="destructive" loading loadingLabel="Deleting">
        Delete
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
