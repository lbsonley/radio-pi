import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  FaPlay,
  FaStop,
  FaForward,
  FaBackward,
  FaFastBackward,
  FaFastForward,
  FaVolumeUp,
  FaVolumeDown,
} from "react-icons/fa";
import MediaLibrary from "../Molecules/MediaLibrary";
import Control from "../Atoms/Control";
import { FlexWrapper, Container } from "../Styled";
import { libraryPropTypes } from "../../prop-types";

const ControlPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index:1;
`;

const InfoPanel = styled(Container)`
  margin-top: 190px;
  background-color: white;
`;

const ScrollableText = styled.p`
  white-space: nowrap;
  overflow-x: scroll;
`;

const Player = ({ emit, library, nowPlaying }) => {
  const [selectedFile, setSelectedFile] = useState({ path: "", name: "" });

  const buttons = {
    back600: {
      title: "<<",
      icon: <FaFastBackward />,
      size: 1,
      payload: { action: "back600" },
    },
    back30: {
      title: "<",
      icon: <FaBackward />,
      size: 1,
      payload: { action: "back30" },
    },
    play: {
      title: "play/plause",
      icon: <FaPlay />,
      size: 6,
      payload: {
        action: "play",
        path: selectedFile.path,
        name: selectedFile.name,
      },
    },
    stop: {
      title: "stop",
      icon: <FaStop />,
      size: 2,
      payload: { action: "stop" },
    },
    forward30: {
      title: ">",
      icon: <FaForward />,
      size: 1,
      payload: { action: "forward30" },
    },
    forward600: {
      title: ">>",
      icon: <FaFastForward />,
      size: 1,
      payload: { action: "forward600" },
    },
  };

  const volume = {
    volDown: {
      title: "Vol -",
      icon: <FaVolumeDown />,
      size: 2,
      payload: { action: "volume", direction: "down" },
    },
    volUp: {
      title: "Vol +",
      icon: <FaVolumeUp />,
      size: 2,
      payload: { action: "volume", direction: "up" },
    },
  };

  return (
    <FlexWrapper direction="column">
      <ControlPanel>
        <FlexWrapper>
          {Object.keys(buttons).map((key) => (
            <Control
              title={buttons[key].title}
              icon={buttons[key].icon}
              size={buttons[key].size}
              payload={buttons[key].payload}
              routeControl={emit}
            />
          ))}
        </FlexWrapper>
        <FlexWrapper>
          {Object.keys(volume).map((key) => (
            <Control
              title={volume[key].title}
              icon={volume[key].icon}
              size={volume[key].size}
              payload={volume[key].payload}
              routeControl={emit}
            />
          ))}
        </FlexWrapper>
        <Container>
          <ScrollableText>
            Now Playing:
            {nowPlaying.name}
          </ScrollableText>
        </Container>
      </ControlPanel>
      <InfoPanel>
        {selectedFile.name ? (
          <ScrollableText>
            Next:
            {selectedFile.name}
          </ScrollableText>
        ) : null}
        <div>
          <MediaLibrary library={library} handleSelection={setSelectedFile} />
        </div>
      </InfoPanel>
    </FlexWrapper>
  );
};

Player.propTypes = {
  emit: PropTypes.func.isRequired,
  library: libraryPropTypes.library.isRequired,
  nowPlaying: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Player;
