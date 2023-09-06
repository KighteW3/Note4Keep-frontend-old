import { hostB, hostF, portF } from "./host";

const runningOn = import.meta.env.VITE_RUNNING;

export const URLbackend = `https://${hostB}`;

let frontendDirect = "";

if (runningOn) {
  if (runningOn === "server") {
    frontendDirect = `https://${hostF}`;
  } else if (runningOn === "local") {
    frontendDirect = `http://${hostF}:${portF}`;
  }
}

export const URLFrontend = frontendDirect;
