import { queryObjects } from "v8";
import { Vessel } from "./Vessel";
// Placeholder types — replace with your actual definitions

export class Dock {
  public name: string;
  public length: number;
  public depth: number;
  public width: number;
  public dockType: string[];
  public isOccupied: boolean;
  public currentVessel: Vessel | null;
  public vesselCall: Vessel[] = [];
  public queue: Vessel[] = [];

  constructor(name:string, length: number, depth: number, width: number, dockType: string[]) {
    this.name = name;
    this.length = length;
    this.depth = depth;
    this.width = width;
    this.dockType = dockType;
    this.isOccupied = false;
    this.currentVessel = null;
  }

  public addVessel(vessel: Vessel) {
    this.vesselCall.push(vessel);
  }

  public removeVessel(vessel: Vessel) {
    this.vesselCall = this.vesselCall.filter(delVessel => delVessel != vessel);
  }

  public moveToQueue(vessel: Vessel) {
    this.removeVessel(vessel);
    this.queue.push(vessel);
  }

  public dock(vessel: Vessel): boolean {
    if (!(this.isOccupied || (this.length >= vessel.size.length && this.width >= vessel.size.width && this.depth >= vessel.size.depth))) {
      return false;
    }

    this.currentVessel = vessel;
    this.isOccupied = true;
    console.log("Vessel " + vessel.name + " docked at dock " + this.name);
    setTimeout(() => {this.undock(vessel)}, vessel.unloadTimeframe)
    return true;
  }

  public undock(vessel: Vessel): void {
    console.log("Vessel " + vessel.name + " undocked")
    this.currentVessel = null;
    this.isOccupied = false;
  }
}


