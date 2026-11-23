import { Button } from "@legionv4/ui";

export function ButtonLinkExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" asChild>
        <a href="#usage">Read the usage section</a>
      </Button>
      <Button asChild>
        <a href="#accessibility">Accessibility notes</a>
      </Button>
    </div>
  );
}
