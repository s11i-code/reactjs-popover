import { useEffect } from "react";

export default function useEventHandler(
	eventName: string,
	handler: (event: Event) => void,
	target: EventTarget | null | undefined = window,
) {
	// attach event handler when component mounts (not on every render) so only one attached at a time
	// you do not want multiple event handlers firing on the same event
	useEffect(() => {
		target?.addEventListener(eventName, handler);
		return () => {
			target?.removeEventListener(eventName, handler);
		};
	}, [eventName, handler, target]);
}
