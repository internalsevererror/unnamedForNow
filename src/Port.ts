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
    fetch("localhost:5000/predict")
      .then((res) => res.json())
      .then((data) => {
        prediction = data.best_dock;
      })
      .catch((err) => {
        console.log("API error");
      });
      /*if(prediction != 0) {
        this.docks[prediction].addVessel(vessel);
      }*/
    console.log(
      "Assigned vessel " + vessel.name + " to dock " + prediction
    );
  }
}
