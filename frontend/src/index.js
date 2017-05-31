import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "mobx-react"
import App from "./App"
import RaceStore from "./stores/RaceStore"

ReactDOM.render(
	<Provider raceStore={new RaceStore()}>
		<App />
	</Provider>,
	document.getElementById("root")
)
