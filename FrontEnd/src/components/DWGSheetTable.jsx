import { useEffect, useState } from "react";
import { TableButton } from "./common/TableButton";
import ChildTable from "./common/ChildTable";
import api from "../api/service.js";

const DWGSheetTable = ({ dwg }) => {
  const [sheets, setSheets] = useState([]);
  const [layoutsToPrint, setLayoutsToPrint] = useState([]);
  const [theTimeout, setTheTimeout] = useState();
  const [hackTheShit, setHackTheShit] = useState(0);

  useEffect(() => {
    setSheets(dwg.layouts);
  }, []);

  useEffect(() => {
    if (layoutsToPrint.length == 0) {
    } else {
      setTheTimeout(
        setTimeout(() => {
          console.log("Sendes til publisering om 5 sec");
          sendLayoutsToPublishing();
        }, 5000)
      ); // This is done so we dont spinn up 1000 instanses of AutoCAD Core Console
      return () => clearTimeout(theTimeout);
    }
  }, [layoutsToPrint]);

  useEffect(() => {
    if (hackTheShit != 0) setSheets([...sheets]);
  }, [hackTheShit]);

  const addToPublishQue = (sheet) => {
    sheet.hidePrintButton = true;
    setSheets([...sheets]);
    clearTimeout(theTimeout);

    setLayoutsToPrint((prevLayouts) => {
      const newLayouts = [...prevLayouts, sheet];
      return newLayouts;
    });
  };

  const sendLayoutsToPublishing = () => {
    // HERRRRRRRR

    const printLayouts = async (obj) => {
      const response = await api.put("/api/DWGPrinter", obj);
      console.log(response.data);
      let done = false;
      while (!done) {
        if (theChecker(response.data)) done = true;
      }
      setSheets([...sheets]);
      setTimeout(() => {
        setHackTheShit(hackTheShit + 1);
        console.log(hackTheShit);
      }, 500);
      console.log(sheets);
      console.log(hackTheShit);
    };

    const theChecker = async (ticketNumber) => {
      console.log(ticketNumber);
      const response = await api.get(
        `/api/DWGPrinter?ticketNumber=${ticketNumber}`
      );
      console.log(response);
      if (response == undefined || response == -1 || response == -69) {
        return false;
      }
      console.log("Its done BOYZZZZZ");
      const data = response.data;

      sheets.map((e) => {
        const match = data.layouts.find((f) => f.name == e.name);
        e.filePath = match.filePath;
        e.lastPrinted = match.lastPrinted;
        console.log(match);
        console.log(e);
      });

      return true;
    };

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

    printLayouts(output);

    //const interval = setInterval(theChecker, 1000, ticket);
  };

  const handleOptionChange = (e, sheet) => {
    const updateSheetStaus = async (sheet) => {
      console.log(sheet);
      const response = await api.put(`/api/LayoutStatusUpdater/`, {
        name: sheet.name,
        status: sheet.status,
        parentPath: sheet.parentFilePath,
        toBePrinted: false,
      });

      console.log(response);

      checkPublisher(response);
    };

    sheet.status = e.target.value;

    updateSheetStaus(sheet);

    setSheets([...sheets]);
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
          <tr key={Math.floor(Math.random() * 1000000)}>
            <td>{sheet.name}</td>
            <td>
              {
                <select
                  value={sheet.status}
                  onChange={(e) => {
                    handleOptionChange(e, sheet);
                  }}
                >
                  <option value="Ikke påbegynt">Ikke påbegynt</option>
                  <option value="Under prosjektering">
                    Under prosjektering
                  </option>
                  <option value="Klar for produksjon">
                    Klar for produksjon
                  </option>
                  <option value="Under produksjon">Under produksjon</option>
                  <option value="Produsert">Produsert</option>
                  <option value="Levert">Levert</option>
                </select>
              }
            </td>
            <td>
              {sheet.lastPrinted == "0001-01-01T00:00:00"
                ? "Ikke printet"
                : new Date(sheet.lastPrinted)
                    .toLocaleString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      hourCycle: "h23",
                    })
                    .replace(" at", ". Kl:")}
            </td>
            <td>
              {dwg.lastUpdated < sheet.lastPrinted ? (
                sheet.filePath
              ) : sheet.hidePrintButton ? (
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
