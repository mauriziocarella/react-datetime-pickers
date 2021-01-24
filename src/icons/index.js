import React from "react"
// import { ReactComponent as IconArrowRight } from "./arrow_right.svg"
// import { ReactComponent as IconArrowLeft } from "./arrow_left.svg"
// import { ReactComponent as IconArrowUp } from "./arrow_up.svg"
// import { ReactComponent as IconArrowDown } from "./arrow_down.svg"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

const IconArrowLeft = () => (
	<FontAwesomeIcon icon="chevron-left"/>
);
const IconArrowRight = () => (
	<FontAwesomeIcon icon="chevron-right"/>
);
const IconArrowUp = () => (
	<FontAwesomeIcon icon="chevron-up"/>
);
const IconArrowDown = () => (
	<FontAwesomeIcon icon="chevron-down"/>
);
const IconClock = () => (
	<FontAwesomeIcon icon="clock"/>
);
const IconCalendar = () => (
	<FontAwesomeIcon icon="calendar-alt"/>
);

export {
	IconArrowRight,
	IconArrowLeft,
	IconArrowUp,
	IconArrowDown,
	IconClock,
	IconCalendar,
}