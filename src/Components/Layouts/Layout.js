import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const Layout = ({ title, controls, appBarAction, children }) => (  
  <Box
    height="100%"
    display="flex"
    flexDirection="column"
  >
    <AppBar
      position="static"
      style={{
        flex: "0 1 auto"
      }}
    >
      <Toolbar
        component={Box}
        display="flex"
      >
        <Typography
          variant="h6"
          component="h1"
          style={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        {appBarAction}
      </Toolbar>
    </AppBar>
    <Container style={{
      flex: "1 0 70%",
      overflow: "hidden"
    }}>
      
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        pb={2}
      >
        {children}
      </Box>
    </Container>
    {controls ? (
      <Box flex="0 1 auto">
        {controls}
      </Box>
    ) : null}
  </Box>
);

export default Layout;
