import React from "react";
import { PdfViewer } from "./components/PdfViewer";

function App() {
  const pathToFile =
    // "./lyvyMarketSegment.pdf";
    // "./StatementOfReturn.pdf";
    // "./Eng.pdf";
    "./RxJs.pdf";

  return (
    <div className="App">
      <PdfViewer pathToFile={pathToFile} />
    </div>
  );
}

export default App;
