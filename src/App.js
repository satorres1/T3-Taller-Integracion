
import './App.css';
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./Chat"
import Vuelos from "./Vuelos"
const ENDPOINT = "ws://tarea-3-websocket.2021-1.tallerdeintegracion.cl";



function App() {
  

  return (
    <div>
      <Vuelos/>
    </div>
  );
}

export default App;


