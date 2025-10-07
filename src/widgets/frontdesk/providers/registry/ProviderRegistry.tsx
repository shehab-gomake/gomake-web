import React, { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { Channel } from '../../layouts/components/NavigationSidebar';

// Lazy load providers to improve initial bundle size
const UnifiedProvider = lazy(() => import('../unified/UnifiedProvider'));
const EmailProvider = lazy(() => import('../email/email-provider-view').then(m => ({ default: m.EmailProviderView })));
const InternalProvider = lazy(() => import('../internal/internal-provider').then(m => ({ default: m.InternalProvider })));

// Placeholder components for providers not yet implemented
const WhatsAppProvider = lazy(() => Promise.resolve({ 
  default: () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <h2>WhatsApp Provider</h2>
      <p>Coming soon...</p>
    </Box>
  )
}));

// Provider configuration
interface ProviderConfig {
  component: React.LazyExoticComponent<React.FC<any>>;
  name: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
}

// Provider registry map
const providerRegistry: Record<Channel, ProviderConfig> = {
  all: {
    component: UnifiedProvider,
    name: 'Unified Inbox',
    requiresAuth: false
  },
  email: {
    component: EmailProvider,
    name: 'Email',
    requiresAuth: true
  },
  whatsapp: {
    component: WhatsAppProvider,
    name: 'WhatsApp',
    requiresAuth: true
  },
  internal: {
    component: InternalProvider,
    name: 'Direct Messages',
    requiresAuth: false
  }
};

// Provider wrapper component with loading state
interface ProviderWrapperProps {
  channel: Channel;
  [key: string]: any; // Pass through any additional props
}

export const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ channel, ...props }) => {
  const config = providerRegistry[channel];
  
  if (!config) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <h2>Provider Not Found</h2>
        <p>The selected provider &quot;{channel}&quot; is not available.</p>
      </Box>
    );
  }
  
  const { component: Component } = config;
  
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

// Utility functions
export const getProvider = (channel: Channel): ProviderConfig | undefined => {
  return providerRegistry[channel];
};

export const getProviderComponent = (channel: Channel): React.LazyExoticComponent<React.FC<any>> | undefined => {
  const config = providerRegistry[channel];
  return config?.component;
};

export const isProviderAvailable = (channel: Channel): boolean => {
  return channel in providerRegistry;
};

export const getAvailableProviders = (): Channel[] => {
  return Object.keys(providerRegistry) as Channel[];
};

export const requiresAuthentication = (channel: Channel): boolean => {
  const config = providerRegistry[channel];
  return config?.requiresAuth ?? false;
};

// Export registry for external use
export default providerRegistry;