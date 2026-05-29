# client/agents.md

## Component rules
- Use fireEvent.touchEnd not userEvent.click (mobile web)
- Assert aria-disabled on the button AND its wrapper element
- Test rendered output only - never internal state or implementation
- Error messages asserted by text content, not CSS class
- Always set viewport to 375px in jsdom setup

## Form rules
- Submit triggers onSubmit prop with correct payload
- Validation errors appear inline below the field
- Loading state: button disabled + aria-busy="true"

## §12 Test patterns (resolved failures)

### 2026-05-28 LoginForm - Component
- Problem: click event not firing on mobile
- Fix: changed userEvent.click to fireEvent.touchEnd
- Rule: always use fireEvent.touchEnd for interactive elements

### 2026-05-28 LoginForm - aria
- Problem: aria-disabled only on button, not ion-item wrapper
- Fix: assert both button[aria-disabled] and ion-item[aria-disabled]
- Rule: assert aria-disabled on element AND nearest ion-* wrapper
