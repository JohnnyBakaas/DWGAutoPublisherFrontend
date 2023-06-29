import React, { useEffect, useState } from "react";
import api from "../api/service.js";
import DWGTable from "./DWGTable.jsx";
import { TableButton } from "./common/TableButton.jsx";
import TdWithName from "./common/TdWithName.jsx";
import styled from "styled-components";

const ParentTable = styled.table`
  width: 1000px;
`;

const Overview = () => {
  const contrastColor = "#353535";
  const [update, setUpdate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projectsData, setProjectData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const getProjects = async () => {
      const respnse = await api.get(`/api/DWGsToFrontEnd`);
      const data = respnse.data;
      setProjectData(data);
      console.log(data);
    };

    getProjects();
    setLoading(false);
  }, [update]);

  const getNewData = () => {
    setUpdate(update + 1);
  };

  const showDWGs = (project) => {
    project.display = !project.display;
    setProjectData([...projectsData]);
  };

  if (loading) return <div>... Laster ...</div>;

  return (
    <>
      <button onClick={getNewData}>Oppdater hele driten</button>
      <ParentTable>
        <thead>
          <tr>
            <th>Navn</th>
            <th>Antall filer</th>
            <th>Klar for produksjon</th>
            <th>Tegninger</th>
          </tr>
        </thead>
        <tbody>
          {projectsData.map((project, i) => (
            <React.Fragment key={project.projectNumber}>
              <tr style={i % 2 ? { backgroundColor: contrastColor } : null}>
                <TdWithName>{project.displayName}</TdWithName>

                <td>
                  {project.dwGs.length}{" "}
                  {/* Legg til sjekking av status på layoutsa */}
                </td>

                <td>
                  {
                    project.dwGs.filter(
                      (e) => e.status == "Klar for produksjon"
                    ).length
                  }
                </td>

                <td>
                  <TableButton
                    selected={project.display}
                    onClick={() => {
                      showDWGs(project);
                    }}
                  >
                    Vis
                  </TableButton>
                </td>
              </tr>
              {project.display ? (
                <tr style={i % 2 ? { backgroundColor: contrastColor } : null}>
                  <td colSpan="4">
                    <DWGTable dwgs={project.dwGs} />
                  </td>
                </tr>
              ) : (
                ""
              )}
            </React.Fragment>
          ))}
        </tbody>
      </ParentTable>
    </>
  );
};

export default Overview;
