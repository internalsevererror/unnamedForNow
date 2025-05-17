import {Dock} from "./Dock"
import { Vessel } from "./Vessel";

export class Port {
  public name:string;
  public docks: Dock[];

  constructor(name: string, docks: Dock[]) {
    this.name = name;
    this.docks = docks;
  } 

  public addVessel(vessel: Vessel): void {
    //choose dock and call addVessel on that dock
    this.docks[0].addVessel(vessel);
    console.log("Assigned vessel " + vessel.name + " to dock " + this.docks[0].name)
  }
}
