import { useEffect, useState } from "react";
import api from "../api/service.js";
import DWGTable from "./DWGTable.jsx";
import { TableButton } from "./common/TableButton.jsx";
import TdWithName from "./common/TdWithName.jsx";
import styled from "styled-components";

const ParentTable = styled.table`
  width: 800px;
`;

const Overview = () => {
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
          {projectsData.map((project) => (
            <>
              <tr key={project.projectNumber}>
                <TdWithName>{project.displayName}</TdWithName>
                <td>
                  {project.dwGs.length}{" "}
                  {/* Legg til sjekking av status på layoutsa */}
                </td>

                <td>
                  {
                    project.dwGs.filter(
                      (e) => e.status == "klar for produksjon"
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
                <tr
                  key={project.projectNumber * Math.floor(Math.random() * 100)}
                >
                  <td colSpan="4">
                    <DWGTable dwgs={project.dwGs} />
                  </td>
                </tr>
              ) : null}
            </>
          ))}
        </tbody>
      </ParentTable>
    </>
  );
};

export default Overview;