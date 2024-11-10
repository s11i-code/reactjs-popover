# ReactJS Popover

This component bridges the gap between React and the Popover API,  the browser-native popover implementation. 

## Why use the Popover API in React
- Popovers are promoted to their own layer – no more z-index trickery needed. 
- You can use the full power of CSS, including backdrops and entry and exit animations. 
- Good accessibility thanks to the Popover API (trapping focus, ESC dismiss when type is `auto` etc) 

## Usage
TODO

## Limitations: 
- Popover API browser support is pretty good but doesn't cover eerything
- This package also uses the fairly new CSS anchor positioning which is not yet supported by all browsers. Polyfills are available for the Popover API and anchor positioning. 