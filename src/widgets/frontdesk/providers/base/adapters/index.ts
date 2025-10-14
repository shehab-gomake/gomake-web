/**
 * Provider Adapters
 *
 * Adapters wrap legacy provider hooks to conform to UnifiedProvider interface.
 * This allows gradual migration without breaking existing code.
 *
 * Usage:
 * ```typescript
 * const internalHook = useInternalProvider();
 * const unifiedProvider = internalProviderAdapter.adapt(internalHook);
 * ```
 */

export { InternalProviderAdapter, internalProviderAdapter } from './internal-provider.adapter';
export { EmailProviderAdapter, emailProviderAdapter } from './email-provider.adapter';

// TODO: Implement remaining adapters
// export { WhatsAppProviderAdapter, whatsappProviderAdapter } from './whatsapp-provider.adapter';
// export { TicketsProviderAdapter, ticketsProviderAdapter } from './tickets-provider.adapter';