import styled from "styled-components";

export const TableButton = styled.button`
  all: unset;
  background-color: ${(props) => (props.selected ? "#cc0000" : "#009d05")};
  text-align: center;
  width: 100%;
  height: 100%;
`;
