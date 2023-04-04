import React from "react";
import { PdfViewer } from "./components/PdfViewer";

function App() {
  const pathToPdf =
    // "./lyvyMarketSegment.pdf";
    // "./StatementOfReturn.pdf";
    // "./Eng.pdf";
    "./RxJs.pdf";

  return (
    <div className="App">
      <PdfViewer pathToPdf={pathToPdf} />
    </div>
  );
}

export default App;
