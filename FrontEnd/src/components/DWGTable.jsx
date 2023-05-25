import { useEffect, useState } from "react";
import { TableButton } from "./common/TableButton";
import DWGSheetTable from "./DWGSheetTable";
import ChildTable from "./common/ChildTable";
import TdWithName from "./common/TdWithName";

const DWGTable = ({ dwgs }) => {
  const [copyOfDWGs, setCopyOfDWGs] = useState();

  useEffect(() => {
    setCopyOfDWGs(dwgs);
  }, []);

  const showSheets = (dwg) => {
    const foundDWG = copyOfDWGs.find((e) => e.filePath == dwg.filePath);
    foundDWG.display = !foundDWG.display;
    setCopyOfDWGs([...copyOfDWGs]);
  };

  return (
    <ChildTable>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Status</th>
          <th>Sisst revidert</th>
          <th>Publiser</th>
          <th>Layouts</th>
        </tr>
      </thead>
      <tbody>
        {dwgs.map((dwg) => (
          <>
            <tr key={dwg.fileName}>
              <TdWithName>{dwg.fileName}</TdWithName>
              <td>{dwg.status}</td>
              <td>
                {new Date(dwg.lastUpdated)
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
                <button
                  onClick={() => {
                    //showDWGs(sheet);
                  }}
                >
                  Print
                </button>
              </td>
              <td>
                <TableButton
                  selected={dwg.display}
                  onClick={() => {
                    showSheets(dwg);
                  }}
                >
                  Vis
                </TableButton>
              </td>
            </tr>
            {dwg.display ? (
              <tr>
                <td colSpan="5">
                  <DWGSheetTable dwg={dwg} />
                </td>
              </tr>
            ) : null}
          </>
        ))}
      </tbody>
    </ChildTable>
  );
};

export default DWGTable;
