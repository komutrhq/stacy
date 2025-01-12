import { HelmetProvider } from "react-helmet-async";

function App() {
	return (
		<HelmetProvider>
			<h1 className="text-3xl font-bold font-display">Hello world!</h1>
		</HelmetProvider>
	);
}

export default App;
