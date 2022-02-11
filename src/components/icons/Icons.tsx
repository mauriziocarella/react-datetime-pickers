import React from "react";

interface IconProps {
	size?: "sm" | "lg" | string,
}

const styles = ({ size = "1.35rem" }: IconProps): React.CSSProperties => {
	const styles = {
		width: "1.35rem",
		height: "1.35rem"
	};

	switch (size) {
		case "sm":
			size = "1rem";
			break;
		case "lg":
			size = "1.5rem";
			break;
	}

	if (size) {
		styles.width = size;
		styles.height = size;
	}

	return styles;
};

const IconArrowLeft: React.VFC<IconProps> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={styles(props)}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
	</svg>
);
const IconArrowRight: React.VFC<IconProps> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={styles(props)}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
	</svg>
);
const IconArrowUp: React.VFC<IconProps> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={styles(props)}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
	</svg>
);
const IconArrowDown: React.VFC<IconProps> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={styles(props)}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
	</svg>
);
const IconCalendar: React.VFC<IconProps> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={styles(props)}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
	</svg>
);
const IconClock: React.VFC<IconProps> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={styles(props)}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
);

export {
	IconArrowRight,
	IconArrowLeft,
	IconArrowUp,
	IconArrowDown,
	IconClock,
	IconCalendar
};
