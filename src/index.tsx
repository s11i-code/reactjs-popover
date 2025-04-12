// Custom type definition to add the popover attribute as we wait for Popover API support to land in React

import {
	type CSSProperties,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useOnContainerScroll } from "./hooks/useOnContainerScroll";
import type { EventState, PopoverProps, PopoverState, Position } from "./types";

const DEFAULT_RENDER_ON_SHOW = false;

export default function Popover<T extends boolean>({
	children,
	id,
	className = "",
	type = "auto",
	remountChildrenOnShow = DEFAULT_RENDER_ON_SHOW as T,
	showHideButton = true,
	closeOnScroll = true,
	position,
	onHide,
	onShow,
	onToggle,
}: PopoverProps<T>) {
	const el = useRef<HTMLDivElement>(null);
	// this only exists to trigger a re-render when the popover is toggled::
	const [, setRenderToggle] = useState<EventState>("closed");
	const eventState = useRef<EventState>("closed");

	// Add the anchor name to make to trigger button to anchor to the popover to it:
	useEffect(() => {
		const element: HTMLElement | null = document.querySelector(
			`[popoverTarget="${id}"]`,
		);
		element?.style.setProperty("anchor-name", `--${id}`);

		return () => {
			element?.style.setProperty("anchor-name", "");
		};
	}, [id]);

	const hidePopover = useCallback(
		function hidePopover() {
			el?.current?.hidePopover();
			if (onHide) {
				onHide();
			}
		},
		[onHide],
	);

	const showPopover = useCallback(
		function showPopover() {
			el?.current?.showPopover();
			if (onShow) {
				onShow();
			}
		},
		[onShow],
	);

	const togglePopover = useCallback(
		function togglePopover() {
			el?.current?.togglePopover();
			if (onToggle) {
				onToggle();
			}
		},
		[onToggle],
	);

	const handleStateChange = useCallback(
		(event: Event) => {
			// type assert because the type is string for some reason in the official types
			// I haven't seen anything other than "open" or "closed" so far and the MDN seems to agree:
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforetoggle_event
			const newState = (event as ToggleEvent).newState as EventState;
			eventState.current = newState;

			if (remountChildrenOnShow) {
				setRenderToggle(newState);
			}
		},
		[remountChildrenOnShow],
	);

	useEffect(() => {
		const element = el.current;
		element?.addEventListener("beforetoggle", handleStateChange);
		return () => {
			element?.removeEventListener("beforetoggle", handleStateChange);
		};
	}, [handleStateChange]);

	useOnContainerScroll(() => {
		// you usually want to close the popover when the user scrolls as otherwise it can be left open and end up in weird places:
		if (closeOnScroll) {
			hidePopover();
		}
	}, el.current);

	// Typescript isn't smart enough to know that the state is always "open" so need to help it with a type asseertion:
	const state: PopoverState<T> = (
		remountChildrenOnShow ? eventState.current : "indetermined"
	) as PopoverState<T>;

	return (
		<section
			style={getStyle(position, id)}
			id={id}
			ref={el}
			popover={type}
			className={className}
			data-testid="popover"
		>
			{showHideButton && (
				<button
					type="button"
					className="float-right text-lg"
					onClick={hidePopover}
				>
					&#x2715;
				</button>
			)}

			{/* React doesn't re-render children that are given as prop when parent props change unless children are re-mounted.
      So we have to re-mount them manually by removing them and bringing them back when popover state is toggled */}
			{(!remountChildrenOnShow || eventState.current === "open") &&
				children({
					state,
					hidePopover,
					showPopover,
					togglePopover,
				})}
		</section>
	);
}

function getStyle(position: Position | undefined, id: string): CSSProperties {
	let style = position
		? { positionAnchor: `--${id}`, right: "anchor(right)" }
		: {};
	const inverseCSSPropertyVertical = position?.includes("bottom")
		? "top"
		: "bottom";

	if (position?.includes("bottom")) {
		style = {
			...style,
			[inverseCSSPropertyVertical]: "anchor(bottom)",
		};
	} else if (position === "top") {
		style = { ...style, [inverseCSSPropertyVertical]: "anchor(bottom)" };
	}

	const inverseCSSPropertyHorizontal = position?.includes("left")
		? "right"
		: "left";

	if (position?.includes("left")) {
		style = {
			...style,
			[inverseCSSPropertyHorizontal]: "anchor(left)",
		};
	} else if (position?.includes("right")) {
		style = { ...style, [inverseCSSPropertyHorizontal]: "anchor(left)" };
	}

	return style;
}
