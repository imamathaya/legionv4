import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Button as PackageButton } from "../src";
import { Button as CopyButton } from "./generated/components/ui/button";

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost"] as const;
const SIZES = ["sm", "default", "lg"] as const;

describe("copy item parity", () => {
  for (const variant of VARIANTS) {
    for (const size of SIZES) {
      it(`${variant}/${size} matches the package markup`, () => {
        const packaged = render(
          <PackageButton variant={variant} size={size}>
            Parity
          </PackageButton>,
        );
        const copied = render(
          <CopyButton variant={variant} size={size}>
            Parity
          </CopyButton>,
        );
        expect(copied.container.innerHTML).toBe(packaged.container.innerHTML);
        packaged.unmount();
        copied.unmount();
      });
    }
  }

  it("matches loading semantics and data attributes", () => {
    const packaged = render(
      <PackageButton loading loadingLabel="Memuat">
        Saving
      </PackageButton>,
    );
    const copied = render(
      <CopyButton loading loadingLabel="Memuat">
        Saving
      </CopyButton>,
    );
    expect(copied.container.innerHTML).toBe(packaged.container.innerHTML);
    packaged.unmount();
    copied.unmount();
  });

  it("records the source version in the sidecar", () => {
    const sidecar = JSON.parse(
      readFileSync(resolve("packages/ui/registry/button.legion.json"), "utf8"),
    ) as { item?: string; version?: string; documentation?: { en?: string; id?: string } };
    const packageJson = JSON.parse(
      readFileSync(resolve("packages/ui/package.json"), "utf8"),
    ) as { version: string };
    expect(sidecar.item).toBe("button");
    expect(sidecar.version).toBe(packageJson.version);
    expect(sidecar.documentation?.en).toContain("/docs/components/button");
    expect(sidecar.documentation?.id).toContain("/id/docs/components/button");
  });
});
