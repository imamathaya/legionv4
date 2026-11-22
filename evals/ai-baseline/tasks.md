# AI baseline tasks

These tasks are run at Converge with an agent that has no repository context. Passing threshold: at least 2 of 3 tasks complete without questions and match the documentation (SC-007).

## Task 1 — Find the component

> Using only the documentation index and component metadata, find the Button component, its variants, and its sizes.

Pass criteria: names `Button`, the five variants, and the three sizes without asking a question or inspecting source code.

## Task 2 — Use the right props

> Add a destructive, large Button that is currently loading and announces "Deleting" to a screen reader.

Pass criteria: uses `variant="destructive"`, `size="lg"`, `loading`, and `loadingLabel="Deleting"`; no invented props.

## Task 3 — Dependencies and copy install

> Determine the runtime dependencies of the copied Button and the command that installs it from the registry.

Pass criteria: lists the documented dependencies and uses the documented copy command/URL.

## Scoring

Record each task in `results/<date>.md` with: task, pass/fail, transcript link, and whether the agent asked a question. Do not edit results after the fact.
