import { useEffect, useState } from "react";
import { TableButton } from "./common/TableButton";
import ChildTable from "./common/ChildTable";

const DWGSheetTable = ({ dwg }) => {
  const [sheets, setSheets] = useState();
  const [layoutsToPrint, setLayoutsToPrint] = useState([]);
  const [theTimeout, setTheTimeout] = useState();

  useEffect(() => {
    setSheets(dwg.layouts);
  }, []);

  const addToPublishQue = (sheet) => {
    sheet.hidePrintButton = true;
    console.log(sheet);
    setSheets([...sheets]);
    clearTimeout(theTimeout);

    setLayoutsToPrint((prevLayouts) => {
      const newLayouts = [...prevLayouts, sheet];
      console.log(newLayouts);
      return newLayouts;
    });

    console.log(layoutsToPrint);
    console.log("Sendes til publisering om 5 sec");

    setTheTimeout(
      setTimeout(() => {
        sendLayoutsToPublishing();
      }, 5000)
    ); // This is done so we dont spinn up 1000 instanses of AutoCAD Core Console
    return () => clearTimeout(theTimeout);
  };

  const sendLayoutsToPublishing = () => {
    const output = {
      filePath: layoutsToPrint[0].parentFilePath,
      status: "In the end it dosent even mater",
      layoutsFromFrontEnd: [],
    };

    layoutsToPrint.map((e) => {
      output.layoutsFromFrontEnd.push({
        name: e.name,
        status: "string",
        parentPath: e.parentFilePath,
        toBePrinted: true,
      });
    });
    setLayoutsToPrint([]);
    console.log("sendt til publisering");
    console.log(output);
    //TODO Legg til noe som faktisk sender det til plotting
  };

  if (sheets == undefined) return <h1>Å gud hjelpes</h1>;
  if (sheets.length == 0) return <h1>Listen er tom</h1>;
  return (
    <ChildTable>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Status</th>
          <th>Siste print</th>
          <th>Print</th>
        </tr>
      </thead>
      <tbody>
        {sheets.map((sheet) => (
          <tr key={sheet.projectNumber}>
            <td>{sheet.name}</td>
            <td>{sheet.status}</td>
            <td>
              {sheet.lastPrinted == "0001-01-01T00:00:00"
                ? "Ikke printet"
                : sheet.lastPrinted}
            </td>
            <td>
              {sheet.hidePrintButton ? (
                "Printes"
              ) : (
                <TableButton
                  onClick={() => {
                    addToPublishQue(sheet);
                  }}
                >
                  Print
                </TableButton>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </ChildTable>
  );
};

export default DWGSheetTable;
