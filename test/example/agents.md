# root/agents.md

## Framework
- Unit + Component: Vitest + @testing-library/react
- Integration: Vitest + MSW
- E2E: Playwright (iPhone 14 Pro preset)

## Rules
- No mocks except MSW for API calls
- Viewport default: 375px
- Touch: fireEvent.touchEnd not userEvent.click
- Assertions: visible text + aria roles, never CSS classes
- One describe block per test file
- Fail loudly with descriptive messages

## CI
- Runner: GitHub Actions
- Timeout: 10 min
- All tests must pass before merge

## §12 Test patterns
See client/agents.md and server/agents.md for tier-specific patterns.
