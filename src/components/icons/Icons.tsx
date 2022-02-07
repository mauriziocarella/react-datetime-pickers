import React from "react";

const IconArrowLeft: React.VFC = () => (
	<svg xmlns="http://www.w3.org/2000/svg" style={{width: '1.35rem', height: '1.35rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
	</svg>
);
const IconArrowRight: React.VFC = () => (
	<svg xmlns="http://www.w3.org/2000/svg" style={{width: '1.35rem', height: '1.35rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
	</svg>
);
const IconArrowUp: React.VFC = () => (
	<svg xmlns="http://www.w3.org/2000/svg" style={{width: '1.35rem', height: '1.35rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
	</svg>
);
const IconArrowDown: React.VFC = () => (
	<svg xmlns="http://www.w3.org/2000/svg" style={{width: '1.35rem', height: '1.35rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
	</svg>
);
const IconCalendar: React.VFC = () => (
	<svg xmlns="http://www.w3.org/2000/svg" style={{width: '1.35rem', height: '1.35rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
	</svg>
);
const IconClock: React.VFC = () => (
	<svg xmlns="http://www.w3.org/2000/svg" style={{width: '1.35rem', height: '1.35rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
);

export {
	IconArrowRight,
	IconArrowLeft,
	IconArrowUp,
	IconArrowDown,
	IconClock,
	IconCalendar,
}
