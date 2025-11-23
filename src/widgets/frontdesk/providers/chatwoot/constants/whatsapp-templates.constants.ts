/**
 * WhatsApp Template Constants
 *
 * Pre-configured WhatsApp Business templates.
 * In production, these should be fetched from WhatsApp Business Manager
 * or configured per account in application settings.
 *
 * NOTE: All templates must be approved in WhatsApp Business Manager before use.
 */

import {
  WhatsAppTemplate,
  TemplateCategory,
  TemplateStatus,
  HeaderType,
  ButtonType,
} from "../types/whatsapp-templates.types";

/**
 * Sample WhatsApp Templates
 * Replace with your actual approved templates
 */
export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  // === UTILITY TEMPLATES ===
  {
    id: "order_confirmation",
    name: "order_confirmation",
    category: TemplateCategory.UTILITY,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Confirm customer order with order number",
    tags: ["order", "confirmation", "ecommerce"],
    components: {
      header: {
        type: HeaderType.IMAGE,
        example: "https://picsum.photos/400/200?random=1",
      },
      body: {
        text: "Hi {{1}}, your order #{{2}} has been confirmed! We'll send you a shipping update soon.",
        examples: [["John Doe", "ORD-12345"]],
      },
      footer: {
        text: "Thank you for shopping with us!",
      },
      buttons: [
        {
          type: ButtonType.URL,
          text: "Track Order",
          url: "https://example.com/track/{{1}}",
          example: ["ORD-12345"],
        },
      ],
    },
  },
  {
    id: "appointment_reminder",
    name: "appointment_reminder",
    category: TemplateCategory.UTILITY,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Remind customers of upcoming appointments",
    tags: ["appointment", "reminder", "booking"],
    components: {
      body: {
        text: "Hello {{1}}! This is a reminder about your appointment on {{2}} at {{3}}. Please arrive 10 minutes early.",
        examples: [["Sarah", "Nov 15, 2025", "2:00 PM"]],
      },
      footer: {
        text: "Reply CANCEL to cancel your appointment",
      },
      buttons: [
        {
          type: ButtonType.QUICK_REPLY,
          text: "Confirm",
        },
        {
          type: ButtonType.QUICK_REPLY,
          text: "Reschedule",
        },
      ],
    },
  },
  {
    id: "shipping_update",
    name: "shipping_update",
    category: TemplateCategory.SHIPPING_UPDATE,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Notify customers when their order ships",
    tags: ["shipping", "delivery", "tracking"],
    components: {
      body: {
        text: "Great news! Your order #{{1}} has shipped and will arrive on {{2}}. Tracking number: {{3}}",
        examples: [["ORD-12345", "Nov 20, 2025", "1Z999AA10123456784"]],
      },
      buttons: [
        {
          type: ButtonType.URL,
          text: "Track Package",
          url: "https://tracking.example.com/{{1}}",
          example: ["1Z999AA10123456784"],
        },
      ],
    },
  },

  // === MARKETING TEMPLATES ===
  {
    id: "discount_coupon",
    name: "discount_coupon",
    category: TemplateCategory.MARKETING,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Send discount codes to customers",
    tags: ["discount", "promotion", "coupon"],
    components: {
      header: {
        type: HeaderType.IMAGE,
        example: "https://picsum.photos/400/200?random=2",
      },
      body: {
        text: "🎉 Special offer just for you! Get {{1}}% off your next purchase. Use the code below:",
        examples: [["30"]],
      },
      footer: {
        text: "Offer expires in 48 hours",
      },
      buttons: [
        {
          type: ButtonType.COPY_CODE,
          text: "Copy Code",
          example: ["SAVE30"],
        },
        {
          type: ButtonType.URL,
          text: "Shop Now",
          url: "https://shop.example.com",
        },
      ],
    },
  },
  {
    id: "new_product_launch",
    name: "new_product_launch",
    category: TemplateCategory.MARKETING,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Announce new product launches",
    tags: ["product", "launch", "announcement"],
    components: {
      header: {
        type: HeaderType.VIDEO,
        example: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      body: {
        text: "Introducing {{1}}! {{2}} Get yours today with free shipping.",
        examples: [["AirPods Pro 2", "Experience incredible sound quality with active noise cancellation."]],
      },
      buttons: [
        {
          type: ButtonType.URL,
          text: "Learn More",
          url: "https://example.com/products/{{1}}",
          example: ["airpods-pro-2"],
        },
      ],
    },
  },

  // === ACCOUNT UPDATE TEMPLATES ===
  {
    id: "password_reset",
    name: "password_reset",
    category: TemplateCategory.ACCOUNT_UPDATE,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Send password reset instructions",
    tags: ["password", "security", "account"],
    components: {
      body: {
        text: "Hi {{1}}, we received a request to reset your password. Click the button below to create a new password. If you didn't request this, please ignore this message.",
        examples: [["Alex"]],
      },
      footer: {
        text: "This link expires in 1 hour",
      },
      buttons: [
        {
          type: ButtonType.URL,
          text: "Reset Password",
          url: "https://example.com/reset/{{1}}",
          example: ["abc123token"],
        },
      ],
    },
  },
  {
    id: "verification_code",
    name: "verification_code",
    category: TemplateCategory.ACCOUNT_UPDATE,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Send verification codes for 2FA",
    tags: ["verification", "2fa", "security"],
    components: {
      body: {
        text: "Your verification code is: {{1}}\n\nThis code expires in {{2}} minutes. Do not share this code with anyone.",
        examples: [["123456", "5"]],
      },
      buttons: [
        {
          type: ButtonType.COPY_CODE,
          text: "Copy Code",
          example: ["123456"],
        },
      ],
    },
  },

  // === ISSUE RESOLUTION TEMPLATES ===
  {
    id: "support_ticket_created",
    name: "support_ticket_created",
    category: TemplateCategory.ISSUE_RESOLUTION,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Confirm support ticket creation",
    tags: ["support", "ticket", "helpdesk"],
    components: {
      body: {
        text: "Hi {{1}}, we've received your support request (Ticket #{{2}}). Our team will respond within {{3}} hours. You can track your ticket status using the link below.",
        examples: [["Emma", "TICK-7890", "24"]],
      },
      buttons: [
        {
          type: ButtonType.URL,
          text: "View Ticket",
          url: "https://support.example.com/ticket/{{1}}",
          example: ["TICK-7890"],
        },
      ],
    },
  },
  {
    id: "issue_resolved",
    name: "issue_resolved",
    category: TemplateCategory.ISSUE_RESOLUTION,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Notify customer that their issue is resolved",
    tags: ["support", "resolved", "feedback"],
    components: {
      body: {
        text: "Good news! Your support ticket #{{1}} has been resolved. We hope we were able to help. Would you mind rating your experience?",
        examples: [["TICK-7890"]],
      },
      buttons: [
        {
          type: ButtonType.QUICK_REPLY,
          text: "⭐⭐⭐⭐⭐",
        },
        {
          type: ButtonType.QUICK_REPLY,
          text: "⭐⭐⭐⭐",
        },
        {
          type: ButtonType.QUICK_REPLY,
          text: "⭐⭐⭐",
        },
      ],
    },
  },

  // === SIMPLE TEXT TEMPLATES ===
  {
    id: "welcome_message",
    name: "welcome_message",
    category: TemplateCategory.UTILITY,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Welcome new customers",
    tags: ["welcome", "onboarding"],
    components: {
      body: {
        text: "Welcome to {{1}}, {{2}}! 🎉 We're excited to have you. Get started by exploring our catalog or chatting with our team anytime.",
        examples: [["Acme Store", "Michael"]],
      },
    },
  },
  {
    id: "payment_received",
    name: "payment_received",
    category: TemplateCategory.UTILITY,
    language: "en",
    status: TemplateStatus.APPROVED,
    description: "Confirm payment receipt",
    tags: ["payment", "confirmation", "billing"],
    components: {
      body: {
        text: "Payment received! Thank you for your payment of ${{1}} for invoice #{{2}}. Your account has been updated.",
        examples: [["150.00", "INV-2024-001"]],
      },
      footer: {
        text: "Questions? Contact our billing team",
      },
    },
  },
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory | "ALL"): WhatsAppTemplate[] {
  if (category === "ALL") {
    return WHATSAPP_TEMPLATES.filter((t) => t.status === TemplateStatus.APPROVED);
  }
  return WHATSAPP_TEMPLATES.filter(
    (t) => t.category === category && t.status === TemplateStatus.APPROVED
  );
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): WhatsAppTemplate | undefined {
  return WHATSAPP_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get template by name
 */
export function getTemplateByName(name: string): WhatsAppTemplate | undefined {
  return WHATSAPP_TEMPLATES.find((t) => t.name === name);
}

/**
 * Search templates by query
 */
export function searchTemplates(query: string): WhatsAppTemplate[] {
  const lowerQuery = query.toLowerCase();
  return WHATSAPP_TEMPLATES.filter(
    (t) =>
      t.status === TemplateStatus.APPROVED &&
      (t.name.toLowerCase().includes(lowerQuery) ||
        t.description?.toLowerCase().includes(lowerQuery) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        t.components.body.text.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get recently used templates
 */
export function getRecentTemplates(limit: number = 5): WhatsAppTemplate[] {
  return WHATSAPP_TEMPLATES.filter((t) => t.status === TemplateStatus.APPROVED && t.lastUsed)
    .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
    .slice(0, limit);
}

/**
 * Get most used templates
 */
export function getMostUsedTemplates(limit: number = 5): WhatsAppTemplate[] {
  return WHATSAPP_TEMPLATES.filter((t) => t.status === TemplateStatus.APPROVED && t.usageCount)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
}

/**
 * Template category labels for UI
 */
export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory | "ALL", string> = {
  ALL: "All Templates",
  [TemplateCategory.UTILITY]: "Utility",
  [TemplateCategory.MARKETING]: "Marketing",
  [TemplateCategory.SHIPPING_UPDATE]: "Shipping",
  [TemplateCategory.ACCOUNT_UPDATE]: "Account",
  [TemplateCategory.ISSUE_RESOLUTION]: "Support",
};

/**
 * Template category colors for UI
 */
export const TEMPLATE_CATEGORY_COLORS: Record<TemplateCategory, string> = {
  [TemplateCategory.UTILITY]: "#3b82f6", // Blue
  [TemplateCategory.MARKETING]: "#8b5cf6", // Purple
  [TemplateCategory.SHIPPING_UPDATE]: "#10b981", // Green
  [TemplateCategory.ACCOUNT_UPDATE]: "#f59e0b", // Amber
  [TemplateCategory.ISSUE_RESOLUTION]: "#ef4444", // Red
};
