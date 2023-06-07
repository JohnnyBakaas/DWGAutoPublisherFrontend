import { useEffect, useState } from "react";
import { TableButton } from "./common/TableButton";
import api from "../api/service.js";
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

  const handleOptionChange = (e, dwg) => {
    const updateDWGStaus = async (dwg) => {
      console.log(dwg);
      await api.put(`/api/DWGStatusUpdate/`, {
        filePath: dwg.filePath,
        status: dwg.status,
      });
    };

    dwg.status = e.target.value;

    updateDWGStaus(dwg);

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
              <td>
                <select
                  value={dwg.status}
                  onChange={(e) => {
                    handleOptionChange(e, dwg);
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
              </td>
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
