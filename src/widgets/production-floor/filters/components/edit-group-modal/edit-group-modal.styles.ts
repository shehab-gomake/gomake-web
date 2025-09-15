import styled from "styled-components";

export const ScrollableDiv = styled.div`
  max-height: 35vh;
  overflow-y: auto;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #cccdcf;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #b0b0b0;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;
