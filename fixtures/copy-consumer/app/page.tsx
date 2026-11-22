import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <Button>Parity</Button>
      <Button loading loadingLabel="Loading">
        Parity
      </Button>
    </main>
  );
}
