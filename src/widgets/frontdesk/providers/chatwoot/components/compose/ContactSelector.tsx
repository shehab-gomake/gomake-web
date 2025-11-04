/**
 * ContactSelector Component
 *
 * Searchable dropdown for selecting or creating contacts.
 * Supports debounced search by name, email, or phone number.
 */

import React, { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import type { ContactDetail } from "@/services/frontdesk/api/chatwoot/types/contacts.types";

export interface ContactSelectorProps {
  /** Currently selected contact */
  selectedContact: ContactDetail | null;

  /** Contact search results */
  searchResults: ContactDetail[];

  /** Loading state for search */
  isSearching: boolean;

  /** Callback for search query change */
  onSearch: (query: string) => void;

  /** Callback when contact is selected */
  onSelectContact: (contact: ContactDetail) => void;

  /** Callback to open create contact modal */
  onCreateContact: () => void;

  /** Validation error message */
  error?: string;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  selectedContact,
  searchResults,
  isSearching,
  onSearch,
  onSelectContact,
  onCreateContact,
  error,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    onSearch(value);
  };

  const handleSelectContact = (contact: ContactDetail) => {
    onSelectContact(contact);
    setQuery("");
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onSelectContact(null as any);
    setQuery("");
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Contact <span className="text-red-500">*</span>
      </label>

      {/* Selected Contact Display */}
      {selectedContact ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {selectedContact.thumbnail ? (
                <img
                  src={selectedContact.thumbnail}
                  alt={selectedContact.name || "Contact"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <PersonIcon className="w-5 h-5" />
              )}
            </div>

            {/* Contact Info */}
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {selectedContact.name || "Unnamed Contact"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                {selectedContact.email && (
                  <span className="flex items-center gap-1">
                    <MailIcon className="w-3 h-3" />
                    {selectedContact.email}
                  </span>
                )}
                {selectedContact.phone_number && (
                  <span className="flex items-center gap-1">
                    <PhoneIcon className="w-3 h-3" />
                    {selectedContact.phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClearSelection}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <CloseIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Search by name, email, or phone..."
              className={`w-full pl-10 pr-4 py-2 border ${
                error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {/* Create New Contact */}
              <button
                type="button"
                onClick={() => {
                  onCreateContact();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <PersonAddIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Create New Contact
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Add a new contact to your list
                  </div>
                </div>
              </button>

              {/* Search Results */}
              {isSearching ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  Searching contacts...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium shrink-0">
                      {contact.thumbnail ? (
                        <img
                          src={contact.thumbnail}
                          alt={contact.name || "Contact"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <PersonIcon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {contact.name || "Unnamed Contact"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 truncate">
                        {contact.email && (
                          <span className="flex items-center gap-1">
                            <MailIcon className="w-3 h-3 shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </span>
                        )}
                        {contact.phone_number && (
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="w-3 h-3 shrink-0" />
                            {contact.phone_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : query ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No contacts found. Try creating a new one.
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  Start typing to search contacts
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
