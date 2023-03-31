import React from "react";
import { Container } from "./components/Container";

function App() {
  const pathToPdf =
    // "lyvyMarketSegment.pdf";
    // "StatementOfReturn.pdf";
    // "Eng.pdf";
    "RxJs.pdf";

  return (
    <div className="App">
      <Container pathToPdf={pathToPdf} />
    </div>
  );
}

export default App;
