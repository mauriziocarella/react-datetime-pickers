import React from "react"

import "react-datetime-pickers/dist/index.css"

import { Example1 } from "./components/Example1";
import { Example2 } from "./components/Example2";
import { Example3 } from "./components/Example3";

const App: React.VFC = () => {
	return (
		<div className="container mx-auto gap-4">
			<Example1 className="my-2"/>
			<Example2 className="my-2"/>
			<Example3 className="my-2"/>
		</div>
	)
}

export default App
