# ReactJS Popover

A lightweight, accessible popover component for React applications which is built on top of the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API).

## Installation

```bash
npm install reactjs-popover
```

## Installation

```bash
npm install reactjs-popover
```

## Why use the Popover API in React

Using the Popover API in React offers several advantages:

- **Performance**: Popovers are promoted to their own layer, eliminating the need for z-index tricks and ensuring efficient rendering.
- **CSS Power**: Leverage the full capabilities of CSS, including backdrops and entry/exit animations.
- **Accessibility**: The Popover API enhances accessibility by managing focus trapping and providing ESC key dismissal when the type is set to `auto`.


## Usage
```
import { Popover } from 'reactjs-popover';

const POPOVER_ID = "my-popover";

function Example() {
    return (
        <>
            <button popoverTarget={POPOVER_ID}>Toggle popover</button>
            
            <Popover remountChildrenOnShow ={true} position="top" id={POPOVER_ID}>
                {({ showPopover, hidePopover, togglePopover, state }) => (
                    <>
                        <h1>Popover in state {state}</h1>
                        <button onClick={hidePopover}>Hide </button> 
                    </>
                )}
            </Popover>
        </>
    )
}


```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `(options: PopoverOptions) => ReactNode` | Required | Popover content |
| `id` | `string` | Required | Unique identifier for the popover and the `popovertarget` attribute of the button controlling it |
| `type` | `'auto' \| 'manual'` | `'auto'` | Controls popover behavior (see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) for more information)|
| `className` | `string` | `''` | Custom CSS class names |
| `showHideButton` | `boolean` | `false` | Show close button in popover |
| `closeOnScroll` | `boolean` | `true` | Close popover when its container is scrolled  |
| `remountChildrenOnShow` | `boolean` | `false` | Remount children when popover visibility is toggled (see next paragraph for more information) |
| `position` | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'right'` | `'bottom'` | Position of the popover relative to anchor |

## Rendering behaviour 
By default, this component uses the native JS Popover API to manage its visibility. This means that the children elements are rendered once when the parent component renders, regardless of the popover's visibility. They remain hidden in the DOM until the popover is opened. The children will only re-render if their own props change.

However, in some cases, you may want the children to re-render every time the popover is toggled. For example, if the popover contains a form that should reset each time it is opened. To achieve this, you can use the `remountChildrenOnShow` property. When set to `true`, the children will be re-mounted every time the popover's visibility changes. Additionally, the `state` value will be either `open` or `closed`, allowing you to delay heavy rendering until the popover is actually opened.

### PopoverOptions

The children render function receives an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `state` | `'open' \| 'closed'` | Current state of the popover (NOTE: this value is only available when `remountChildrenOnShow` is set to `true`) |
| `hidePopover` | `() => void` | Function to hide the popover |
| `showPopover` | `() => void` | Function to show the popover |
| `togglePopover` | `() => void` | Function to toggle popover state |

## Considerations: 
- [Popover API browser support](https://caniuse.com/?search=popover) is pretty good but doesn't cover everything. 
- [Anchor positioning browser support](https://caniuse.com/?search=anchor) is pretty bad still so the popovers are not positioned as expected on Safari and Firefox.  

Polyfills are available for the Popover API and anchor positioning.
