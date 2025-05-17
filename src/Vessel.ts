import { spawn } from "child_process";

// Size class
export class Size {
  public length: number;
  public width: number;
  public depth: number;

  constructor(length: number, width: number, depth: number) {
    this.length = length;
    this.width = width;
    this.depth = depth;
  }
}

// Vessel class
export class Vessel {
  public size: Size;
  public name: string;
  public cargoType: string;
  public expectedArrival: number; // in ms (timestamp)
  public startingETA: number;
  public speed: number;
  public unloadTimeframe: number; // in ms or seconds, depending on your system
  private weather: number = 1;

  constructor(
    size: Size,
    name: string,
    cargoType: string,
    expectedArrival: number,
    speed: number,
    unloadTimeframe: number
  ) {
    this.size = size;
    this.name = name;
    this.cargoType = cargoType;
    this.expectedArrival = expectedArrival;
    this.startingETA = expectedArrival;
    this.speed = speed;
    this.unloadTimeframe = unloadTimeframe;
  }

  move(): boolean {
    console.log(this.name + " ETA: " + this.expectedArrival);
    if (this.expectedArrival <= 0) {
      return false;
    }
    if (Math.random() < 0.03 && this.weather != 0.8) {
      console.log(this.name + " has encountered bad weather");
      this.weather = 0.8;
      setTimeout(
        () => {
          this.weather = 1;
          console.log(this.name + " got out of the storm");
        },
        Math.random() * (20000 - 5000 + 1) + 5000
      );
    }

    this.expectedArrival -= this.speed * this.weather;
    return true;
  }
}
