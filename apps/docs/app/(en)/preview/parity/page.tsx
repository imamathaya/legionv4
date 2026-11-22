import { Button } from "@legionv4/ui";

export default function ParityPreviewPage() {
  return (
    <main style={{ padding: 24 }}>
      <Button>Parity</Button>
      <Button loading loadingLabel="Loading">
        Parity
      </Button>
    </main>
  );
}
