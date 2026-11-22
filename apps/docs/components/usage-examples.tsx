"use client";

import { BasicExample } from "../examples/button/basic";
import { IconExample } from "../examples/button/icon";
import { LinkExample } from "../examples/button/link";
import { LoadingExample } from "../examples/button/loading";
import { VariantExample } from "../examples/button/variants";

export function UsageExamples() {
  return (
    <div className="space-y-4">
      <BasicExample />
      <VariantExample />
      <LoadingExample />
      <div className="flex flex-wrap items-center gap-2">
        <LinkExample />
        <IconExample />
      </div>
    </div>
  );
}
