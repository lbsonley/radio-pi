import React from "react";
import { createGlobalStyle } from "styled-components";
import Socket from "./Components/Containers/Socket";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font: sans-serif;
  }
`;

const App = () => (
  <>
    <GlobalStyle />
    <Socket />
  </>
);

export default App;
