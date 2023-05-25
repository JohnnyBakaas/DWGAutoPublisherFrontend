import { useEffect, useState } from "react";
import { TableButton } from "./common/TableButton";
import ChildTable from "./common/ChildTable";

const DWGSheetTable = ({ dwg }) => {
  const [sheets, setSheets] = useState();

  useEffect(() => {
    setSheets(dwg.layouts);
  }, []);

  if (sheets == undefined) return <h1>Å gud hjelpes</h1>;
  if (sheets.length == 0) return <h1>Listen er tom</h1>;
  return (
    <ChildTable>
      <thead>
        <tr>
          <th>Navn</th>
          <th>Status</th>
          <th>Navn</th>
          <th>Print</th>
        </tr>
      </thead>
      <tbody>
        {sheets.map((sheet) => (
          <tr key={sheet.projectNumber}>
            <td>{sheet.displayName}</td>
            <td>{sheet.displayName}</td>
            <td>
              <TableButton
                onClick={() => {
                  //showDWGs(sheet);
                }}
              >
                Print
              </TableButton>
            </td>
          </tr>
        ))}
      </tbody>
    </ChildTable>
  );
};

export default DWGSheetTable;
