/**
 * Customer and Contact types for Ticket System
 * Used for displaying customer profiles and managing contacts
 */

// Contact person associated with a customer
export interface Contact {
  id?: string;
  firstName: string;
  lastName?: string;
  title?: string;
  position?: string; // role/job title
  address?: string;
  tel1?: string;
  tel2?: string;
  phone?: string;
  mail?: string;
  defaultInDocsTypes?: string[]; // Document types where this contact is default
  index?: number; // For form management
}

// Full customer/supplier entity
export interface Customer {
  id: string;
  name: string;
  code?: string;
  mail?: string;
  phone?: string;
  isActive?: boolean;
  type?: 'C' | 'S'; // C = Customer, S = Supplier
  contacts?: Contact[];
  // Additional fields that might exist
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  balance?: number;
  createDate?: string;
}

// Customer search result (simplified)
export interface CustomerSearchResult {
  id: string;
  name: string;
  mail?: string;
  phone?: string;
  type: 'C' | 'S';
}

// DTO for updating customer with new contact
export interface UpdateCustomerWithContactDto {
  customer: {
    id: string;
    contacts: Contact[];
    [key: string]: any; // Allow other customer fields
  };
}

// DTO for creating new customer from ticket info
export interface CreateCustomerFromTicketDto {
  name: string;
  mail?: string;
  phone?: string;
  clientType: 'C' | 'S';
}
