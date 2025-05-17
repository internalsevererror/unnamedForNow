import { Dock } from "./Dock";
import { Vessel } from "./Vessel";

export class Port {
  public name: string;
  public docks: Dock[];

  constructor(name: string, docks: Dock[]) {
    this.name = name;
    this.docks = docks;
  }

  public addVessel(vessel: Vessel): void {
    //choose dock and call addVessel on that dock
    let prediction = 0;
    fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        size: {
          length: vessel.size.length,
          width: vessel.size.width,
          depth: vessel.size.depth,
        },
        name: vessel.name,
        cargoType: vessel.cargoType,
        expectedArrival: vessel.expectedArrival,
        speed: vessel.speed,
        unloadTimeframe: vessel.unloadTimeframe,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(
          "Assigned vessel " + vessel.name + " to dock " + data.predictedBerth
        );
            this.docks.find(dock => dock.name == data.predictedBerth)?.addVessel(vessel);
      })
      .catch((err) => {
        console.log("API error: " + err);
      });
  }
}
