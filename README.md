# ReactJS Popover

This component bridges the gap between React and the Popover API, the browser-native popover implementation. 

## Why use the Popover API in React
- Popovers are promoted to their own layer – no more z-index tricks needed. 
- You can use the full power of CSS, including backdrops and entry and exit animations. 
- Good accessibility thanks to the Popover API (trapping focus, ESC dismiss when type is `auto` etc) 

## Usage
```
 const POPOVER_ID = "my-popover";

  return (
    <>
    <button popovertarget={POPOVER_ID}>
      Toggle popover
    </button>
    
    <Popover remountChildrenOnShow ={true} position="top" id={POPOVER_ID}>

      {({ showPopover, hidePopover, togglePopover, state }) => (
        <>
        
        <h1>Popover in state {state}</h1>

        <button onClick={togglePopover}>
         Toggle via JS {}
        </button>

        {state === "open" ? ( <button onClick={hidePopover}>
         Hide via JS
         </button>) : ( <button onClick={showPopover}>
         Show via JS
         </button>)}
    
        </>
      )}
    </Popover>

```

## Limitations: 
- Popover API browser support is pretty good but doesn't cover everything.
- This package also uses the fairly new CSS anchor positioning which is not yet supported by all browsers. Polyfills are available for the Popover API and anchor positioning. 