import type { ReactNode } from "react";

export type EventState = "open" | "closed";

export type PopoverState<T extends boolean> = T extends true
	? EventState
	: "indetermined";

export type ChildProps<T extends boolean> = {
	hidePopover: () => void;
	togglePopover: () => void;
	showPopover: () => void;
	state: PopoverState<T>;
};

export type Position = "bottom" | "top" | "bottom left" | "bottom right";

export interface PopoverProps<T extends boolean = false> {
	children: (props: ChildProps<T>) => ReactNode;
	id: string;
	className?: string;
	type?: "auto" | "manual";
	showHideButton?: boolean;
	position?: Position;
	closeOnScroll?: boolean;
	onHide?: () => void;
	onShow?: () => void;
	onToggle?: () => void;
	remountChildrenOnShow?: T;
}
