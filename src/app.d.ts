// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface PageData {}
    interface Locals {
      ELEVATOR: KVNamespace;
    }
    interface Platform {
      env?: {
        ELEVATOR: KVNamespace;
      };
    }
  }
}

export {};
