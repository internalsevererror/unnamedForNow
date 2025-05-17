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
import { Vessel, Size} from "./Vessel";

let time: number = 0;
let docks: Dock[] = [new Dock("Dock1", 10, 10, 10, ["Cargo"])];
let port: Port = new Port("name1", docks);
let ship: Vessel = new Vessel(new Size(10, 10 ,10), "Cocaine ship", "Cargo", 2000, 20, 10);
port.addVessel(ship);
setInterval(() => {
  //ship update
  port.docks.forEach((dock) => {
    dock.vesselCall.forEach((vessel) => {
      if (!vessel.move()) {
        dock.moveToQueue(vessel);
        console.log("Vessel " + vessel.name + " arrived at dock " + dock.name)
      }
    });
  });

  //dock update
  port.docks.forEach((dock) => {
    if(!dock.isOccupied && dock.queue.length != 0) {
      console.log("Update dock");
      let poppedVessel = dock.queue.pop();
      if(poppedVessel) {
        dock.dock(poppedVessel);
      }

    }
  })
}, 1000);
