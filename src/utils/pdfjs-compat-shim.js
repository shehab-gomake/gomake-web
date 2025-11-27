/**
 * Compatibility shim for pdfjs-dist 4.x to work with react-pdf 8.0.2
 * 
 * react-pdf 8.0.2 expects pdfjs-dist 3.x with a default export,
 * but pdfjs-dist 4.x only has named exports.
 * 
 * This shim provides a default export that re-exports all named exports.
 * 
 * Note: This file is used via webpack alias to replace pdfjs-dist imports.
 * We use require.resolve to get the actual pdfjs-dist path to avoid circular dependency.
 */

// Use require.resolve to get the actual pdfjs-dist module path
// This avoids the webpack alias and prevents circular dependency
const pdfjsDistPath = require.resolve('pdfjs-dist');

// Import using the resolved path (webpack will handle this correctly)
// We need to use a workaround since we can't use dynamic import in this context
// Instead, we'll let webpack handle the import resolution

// For webpack: this will be replaced at build time
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfjsDist = require(pdfjsDistPath);

// Create a default export that contains all the named exports
// This makes it compatible with react-pdf 8.0.2 which expects a default export
const pdfjsModule = {
  ...pdfjsDist,
  // Ensure default property exists
  default: pdfjsDist,
};

// Export as default for compatibility
module.exports = pdfjsModule;

