import React from "react"

import "react-datetime-pickers/dist/index.css"

import { Example1 } from "./components/Example1";
import { Example2 } from "./components/Example2";

const App: React.VFC = () => {
	return (
		<div className="flex flex-col md:flex-row">
			<Example1 className="basis-1/2 mb-2"/>
			<Example2 className="basis-1/2 mb-2"/>
		</div>
	)
}

export default App
