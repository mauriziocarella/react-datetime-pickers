import React from "react"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import faChevronLeft from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import faChevronRight from '@fortawesome/free-solid-svg-icons/faChevronRight';
import faChevronUp from '@fortawesome/free-solid-svg-icons/faChevronUp';
import faChevronDown from '@fortawesome/free-solid-svg-icons/faChevronDown';
import faClock from '@fortawesome/free-solid-svg-icons/faClock';
import faCalendarAlt from '@fortawesome/free-solid-svg-icons/faCalendarAlt';

const IconArrowLeft = () => (
	<FontAwesomeIcon icon={faChevronLeft}/>
);
const IconArrowRight = () => (
	<FontAwesomeIcon icon={faChevronRight}/>
);
const IconArrowUp = () => (
	<FontAwesomeIcon icon={faChevronUp}/>
);
const IconArrowDown = () => (
	<FontAwesomeIcon icon={faChevronDown}/>
);
const IconClock = () => (
	<FontAwesomeIcon icon={faClock}/>
);
const IconCalendar = () => (
	<FontAwesomeIcon icon={faCalendarAlt}/>
);

export {
	IconArrowRight,
	IconArrowLeft,
	IconArrowUp,
	IconArrowDown,
	IconClock,
	IconCalendar,
}
