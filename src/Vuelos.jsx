import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './App.css';
import Chat from "./Chat"
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
const ENDPOINT = "wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl";


const Vuelos = (props) => {
  const [vuelos, setVuelos] = useState([]);
  const [liveInfo, setLiveInfo] = useState({});
 
  const socket = io(ENDPOINT, {path: '/flights'});
  const socket2 = io(ENDPOINT, {path: '/flights'});
  
  const pushNewInfo = (data) => {
    let new_info = liveInfo;
    const code = data.code;
    new_info[code] = data.position;
    //new_info[code].push(data.position);
    
    setLiveInfo(new_info);
  }

  const addNewInfo = (data) => {


    let new_info = liveInfo;
    const code = data.code;
    new_info[code] = data.position;
    setLiveInfo(liveInfo[data.code]);
  }

  useEffect(() => {
    socket2.on('FLIGHTS', data => {
        console.log(data);
        setVuelos(data);
    });

    let new_info = {}
    socket.on('POSITION', data => {
      new_info[data.code] = data.position;
      //setLiveInfo(new_info);
      console.log(new_info);
  });
    
  }, []);

  const getVuelos = () => {
      socket2.emit('FLIGHTS', {});
  }

  return (
    <>
      <MapContainer center={[-37, -65]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vuelos.map((v) => {
        return (
          <>
          <Polyline pathOptions={{ color: 'lime' }} positions={[
          [v.origin[0], v.origin[1]],
          [v.destination[0], v.destination[1]]]} />
          </>
          
        )
        })}
        {Object.entries(liveInfo).map((v) => {
        return (
          <>
          <Marker position={[v[1][0], v[1][1]]}>
            <Tooltip>Vuelo número {v[0]}</Tooltip>
          </Marker>
          </>
        )
        })}


      </MapContainer>
      <div>
        <Button
        className="pedir-vuelos"
        variant="primary"
        onClick={() => getVuelos()}
        >
        {'Pedir información vuelos'}
        </Button>
      </div>
      <Container fluid>
      <Row>
        
      
        {vuelos.map((v) => {
          let pasajero = 0;
          return (
            <Col className="columna">
            <div key={v.code}>
              <p> Vuelo: {v.code} </p>
              <p> Aerolinea: {v.airline} </p>
              <p> Origen: ({v.origin[0]},{v.origin[1]})  </p>
              <p> Destino: ({v.destination[0]},{v.destination[1]}) </p>
              <p> Modelo: {v.plane} </p>
              <p> Asientos: {v.seats} </p>
              <ul>
                {v.passengers.map((p) => {
                    pasajero += 1;
                    return (
                        <li key={p.name}>
                            Pasajero {pasajero} - nombre: {p.name} - edad: {p.age}
                        </li>
                    )
                })}
              </ul>
            </div>
            </Col>
          );
        }
        )}
        
        </Row>
        </Container>
        <Chat/>
    </>
    
   );
}

export default Vuelos