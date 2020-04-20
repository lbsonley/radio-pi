import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Player from "../Organisms/Player";

const socket = io.connect("http://192.168.0.38:8080");

const Socket = () => {
  const [library, setLibrary] = useState({ nodes: {} });
  const [nowPlaying, setNowPlaying] = useState({ name: "" });

  useEffect(() => {
    socket.on("library", (data) => setLibrary(data));
    socket.on("nowPlaying", (data) => setNowPlaying(data));
  }, []);

  const emit = (event, payload) => {
    socket.emit(event, payload);
  };

  return <Player emit={emit} library={library} nowPlaying={nowPlaying} />;
};

export default Socket;
