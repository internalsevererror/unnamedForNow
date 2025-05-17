/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/
import { Port } from "./Port";
import { Dock } from "./Dock";
import { Vessel, Size } from "./Vessel";

let time: number = 0;
let docks: Dock[] = [new Dock("Berth_0", 10, 10, 10, ["Cargo"])];
docks.push(new Dock("Berth_1", 10, 10, 10, ["Cargo"]));
docks.push(new Dock("Berth_2", 10, 10, 10, ["Cargo"]));
docks.push(new Dock("Berth_3", 10, 10, 10, ["Cargo"]));
docks.push(new Dock("Berth_4", 10, 10, 10, ["Cargo"]));

let port: Port = new Port("name1", docks);
let ship1: Vessel = new Vessel(
  new Size(10, 10, 10),
  "Cocaine ship",
  "Passenger",
  2000,
  20,
  2000
);
let ship2: Vessel = new Vessel(
  new Size(10, 10, 10),
  "Meth ship",
  "Passenger",
  2000,
  20,
  2000
);
let ship3: Vessel = new Vessel(
  new Size(10, 10, 10),
  "Fent ship",
  "Passenger",
  2000,
  20,
  2000
);
let ship4: Vessel = new Vessel(
  new Size(10, 10, 10),
  "Ketamine ship",
  "Passenger",
  2000,
  20,
  2000
);
let ship5: Vessel = new Vessel(
  new Size(10, 10, 10),
  "LSD ship",
  "Passenger",
  2000,
  20,
  2000
);
let ship6: Vessel = new Vessel(
  new Size(10, 10, 10),
  "Amphetamine ship",
  "Passenger",
  2000,
  20,
  2000
);

port.addVessel(ship1);
port.addVessel(ship2);
port.addVessel(ship3);
port.addVessel(ship4);
port.addVessel(ship5);
port.addVessel(ship6);
//ship update
setInterval(() => {
  port.docks.forEach((dock) => {
    dock.vesselCall.forEach((vessel) => {
      if (!vessel.move()) {
        dock.moveToQueue(vessel);
        console.log("Vessel " + vessel.name + " arrived at dock " + dock.name);
      }
    });
  });

  //dock update
  port.docks.forEach((dock) => {
    if (!dock.isOccupied && dock.queue.length != 0) {
      console.log("Update dock");
      let poppedVessel = dock.queue.pop();
      if (poppedVessel) {
        dock.dock(poppedVessel);
      }
    }
  });
}, 100);
