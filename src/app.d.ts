// Defines interfaces for global Context
import type { FrontendAPI } from '$lib/interfaces/frontendAPI';
declare global {
  interface Window {
    frontendAPI: FrontendAPI;
  }
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
