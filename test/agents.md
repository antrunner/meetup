# agents.md — Prompt-Based Testing Slides

## TDD analogy

agents.md is written first - before any prompts or tests are run.
This mirrors TDD: in TDD you write the test spec first, then implement.
Here you write agents.md (rules, context, constraints) first, then prompts
and agents generate tests that conform to those rules.
The spec drives the implementation, not the other way around.

## Slide authoring rules

- Use hyphen `-` not em-dash `—` in bullet text
- Each list item must fit on one line (no wrapping)
- Slide width: 1280px (set in Reveal.initialize, do not reduce)
- Right column bottom half: always include one minimal prompt example box
- SVG diagrams: arrows must not cross or overlap any box/rect element
- Textarea elements: no scroll, auto-expand height, capped at available slide space
- Slide 2 format: left = past testing approach, right = prompt-based testing now

## Content rules

- Prompts shown in code blocks: max 8 lines
- Bullet lists: max 5 items per block
- No nested lists
- SVG text: always inside its parent rect, font-size 7.5-9, monospace
- Agent pill label: `⚡ prompt` (7.5px, inside a 52x11 rect)

## Diagram rules

- Arrow routing: go around boxes, never through them
- Use elbow routes (horizontal then vertical) not diagonal when avoiding boxes
- Arrow color: #555 default, #6d28d9 agent flows, #166534 pass, #991b1b fail
