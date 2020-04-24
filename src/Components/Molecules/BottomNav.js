import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import HomeIcon from '@material-ui/icons/Home';

const BottomNav = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);
  
  return (
    <Paper elevation={15}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          component={Link}
          to="/"
          value="/"
        />
        <BottomNavigationAction
          label="Library"
          icon={<LibraryMusicIcon />}
          component={Link}
          to="/library"
          value="/library"
        />
        <BottomNavigationAction
          label="Queue"
          icon={<QueueMusicIcon />}
          component={Link}
          to="/queue"
          value="/queue"
        />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
