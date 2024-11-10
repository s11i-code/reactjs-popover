import { useOnContainerScroll } from "./hooks/useOnContainerScroll";
import { CSSProperties,  useRef, useState } from "react";
import useEventHandler from "./hooks/useEventHandler";

// For now, patch the types to include the popover attribute:
import 'react';
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    popover?: 'auto' | 'manual';
  }
}

type EventState =  'open' | 'closed';

interface ChildProps {
  hidePopover: () => void;
  togglePopover: () => void;
  showPopover: () => void;
  state: EventState;
}

type Position = "bottom" | "top" | "bottom left" | "bottom right";
export interface Props {
  children: (props: ChildProps) => React.ReactNode;
  id: string;
  className?: string;
  type?: "auto" | "manual";
  showHideButton?: boolean;
  // relative to the button that triggers the popover:
  position?: Position
  closeOnScroll?: boolean;
  onHide?: () => void;
  onShow?: () => void;
  onToggle?: () => void;
  // Because this component uses native JS to toggle visibility,  it does NOT re-render the children when toggled between open/closed
  // This is useful for performance reasons when you don't want to re-render children on every toggle.
  // However, you can opt out of this behaviour by re-mounting the children when popover is toggled.
  // This is useful if the children need to reset when popover is toggled (for example form fields, fetching data, etc.)
  remountChildrenOnShow?: boolean;
}

export default function Popover({
  children,
  id,
  className = "",
  type = "auto",
  remountChildrenOnShow = false,
  showHideButton = true,
  closeOnScroll = true,
  position="bottom",
  onHide,
  onShow,
  onToggle,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  // this only exists to trigger a re-render when the popover is toggled::
  const [, setRenderToggle] = useState<EventState>("closed");
  const state = useRef<EventState>("closed");

  function hidePopover() {
    el.current?.hidePopover();
    if (onHide) {
      onHide();
    }
  }

  function showPopover() {
    el.current?.showPopover();
    if (onShow) {
      onShow();
    }
  }

  function togglePopover() {
    el.current?.togglePopover();
    if (onToggle) {
      onToggle();
    }
  }

  function handleStateChange(event: Event) {
    // type assert because the type is string in the official types (for some reason)
    // I haven't seen anything other than "open" or "closed" and MDN seems to agree:
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforetoggle_event
    const newState = (event as ToggleEvent).newState as EventState;
    state.current = newState;
    if (remountChildrenOnShow) {
      setRenderToggle(newState);
    }
  }

  useEventHandler("beforetoggle", handleStateChange, el.current);

  useOnContainerScroll(() => {
    // you often want to close the popover as the user scrolls as otherwise it can be left open and end up in weird places:
    if (closeOnScroll) {
      hidePopover();
    }
  }, el.current);

  

  return (
    <section
      style={
        getStyle(position, id)
      }
      id={id}
      ref={el}
      popover={type}
      className={`reactjs-popover ${className}`}
    >
      {showHideButton && (
        <button className='reactjs-popover_hide-button' onClick={hidePopover}>
          &#x2715;
        </button>
      )}
      {(!remountChildrenOnShow || state.current === "open") &&
        children({
          state: state.current,
          hidePopover,
          showPopover,
          togglePopover,
        })}
    </section>
  );
}


function getStyle(position: Position, id: string): CSSProperties {

    let style = position
    ? { positionAnchor: `--${id}`, right: `anchor(right)` }
    : {};
  const inverseCSSPropertyVertical = position?.includes("bottom")
    ? "top"
    : "bottom";
  if (position?.includes("bottom")) {
    style = {
      ...style,
      [inverseCSSPropertyVertical]: `anchor(bottom)`,
    };
  } else if (position === "top") {
    style = { ...style, [inverseCSSPropertyVertical]: `anchor(bottom)` };
  }

  const inverseCSSPropertyHorizontal = position?.includes("left")
    ? "right"
    : "left";

  if (position?.includes("left")) {
    style = {
      ...style,
      [inverseCSSPropertyHorizontal]: `anchor(left)`,
    };
  } else if (position?.includes("right")) {
    style = { ...style, [inverseCSSPropertyHorizontal]: `anchor(left)` };
  }

  return style
}