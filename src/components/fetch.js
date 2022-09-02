// You don't need to look at this, but you can if you want!

// This module exports fake data fetching functionality.
// In a real app, this would grab data from the internet, but
// this module just waits a little bit before responding.
import { response } from "./apiresponse"

export function get() {
  const delay = Math.floor(Math.random() * 1000) + 500;
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const res = { status: 200, data: response };

      resolve(res);
    }, delay);
  });
}
