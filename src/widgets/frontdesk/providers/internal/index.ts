// Export the new Direct Messages implementation as the main internal provider
export { DirectMessagesProviderView as InternalProvider } from "./direct-messages-provider-view";

// Legacy exports (to be removed eventually)
export { InternalProviderView } from "./internal-provider-view";
export { DirectMessagesProviderView } from "./direct-messages-provider-view";

export * from "./components";
export * from "./hooks";
export * from "./types";
export * from "./utils";
export * from "./store/internal-store";
