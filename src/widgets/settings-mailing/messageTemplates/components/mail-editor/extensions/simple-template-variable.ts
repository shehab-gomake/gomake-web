import { Node, mergeAttributes } from '@tiptap/core';

export interface SimpleTemplateVariableOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    simpleTemplateVariable: {
      setSimpleTemplateVariable: (options: { marker: string; title: string }) => ReturnType;
    };
  }
}

/**
 * Simple template variable extension that matches QuillEditor's TemplateMarker format
 * No React component - just pure TipTap node for reliable HTML serialization
 */
export const SimpleTemplateVariable = Node.create<SimpleTemplateVariableOptions>({
  name: 'simpleTemplateVariable',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      marker: {
        default: null,
        parseHTML: element => element.getAttribute('data-marker'),
        renderHTML: attributes => {
          if (!attributes.marker) {
            return {};
          }
          return {
            'data-marker': attributes.marker,
          };
        },
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {};
          }
          return {
            'data-title': attributes.title,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      // Match QuillEditor's format: span with class="badgeVariable"
      {
        tag: 'span.badgeVariable',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return false;
          const element = dom as HTMLElement;
          const marker = element.getAttribute('data-marker');
          const title = element.getAttribute('data-title') || element.textContent?.trim();
          
          if (marker && title) {
            return { marker, title };
          }
          return false;
        },
      },
      // Also match any span with data-marker attribute
      {
        tag: 'span[data-marker]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return false;
          const element = dom as HTMLElement;
          const marker = element.getAttribute('data-marker');
          const title = element.getAttribute('data-title') || element.textContent?.trim();
          
          if (marker && title) {
            return { marker, title };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { marker, title } = node.attrs;
    
    // Check if this is a link-type variable (contains "link" in title or marker)
    const isLinkVariable = (title && title.toLowerCase().includes('link')) || 
                          (marker && marker.toLowerCase().includes('link'));
    
    // Style based on variable type - links get purple, others get a subtle blue
    const style = isLinkVariable
      ? 'display: inline-block; padding: 4px 10px; background-color: #5048ED; color: #ffffff; border-radius: 4px; font-weight: 500; font-size: 13px; margin: 0 2px;'
      : 'display: inline-block; padding: 3px 8px; background-color: #E8F4FD; color: #1976D2; border-radius: 4px; font-weight: 500; font-size: 13px; margin: 0 2px; border: 1px solid #BBDEFB;';
    
    // Match QuillEditor's format with added styling for visibility
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'class': 'badgeVariable',
        'data-marker': marker,
        'data-title': title,
        'style': style,
      }),
      title || marker,
    ];
  },

  addCommands() {
    return {
      setSimpleTemplateVariable:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

