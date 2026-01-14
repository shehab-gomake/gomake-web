import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateVariableButtonComponent } from './template-variable-button-component';

export interface TemplateVariableButtonOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    templateVariableButton: {
      setTemplateVariableButton: (options: { marker: string; title: string; displayText?: string }) => ReturnType;
    };
  }
}

export const TemplateVariableButton = Node.create<TemplateVariableButtonOptions>({
  name: 'templateVariableButton',

  group: 'inline',

  inline: true,

  selectable: true,

  atom: true,

  draggable: true,

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
      displayText: {
        default: null,
        parseHTML: element => element.getAttribute('data-display-text'),
        renderHTML: attributes => {
          if (!attributes.displayText) {
            return {};
          }
          return {
            'data-display-text': attributes.displayText,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-node-type="templateVariableButton"]',
        priority: 100,
        getAttrs: (dom) => {
          try {
            if (!dom || typeof dom !== 'object') return false;
            const element = dom as HTMLElement;
            if (!element || !element.getAttribute) return false;
            
            const marker = element.getAttribute('data-marker');
            const title = element.getAttribute('data-title') || element.textContent?.trim();
            const displayText = element.getAttribute('data-display-text');
            
            if (marker && title) {
              return {
                marker: marker,
                title: title,
                displayText: displayText || null,
              };
            }
          } catch (error) {
            console.warn('Error parsing templateVariableButton anchor:', error);
          }
          return false;
        },
      },
      {
        tag: 'span[data-node-type="templateVariableButton"]',
        priority: 95,
        getAttrs: (dom) => {
          try {
            if (!dom || typeof dom !== 'object') return false;
            const element = dom as HTMLElement;
            if (!element || !element.getAttribute) return false;
            
            const marker = element.getAttribute('data-marker');
            const title = element.getAttribute('data-title') || element.textContent?.trim();
            const displayText = element.getAttribute('data-display-text');
            
            if (marker && title) {
              return {
                marker: marker,
                title: title,
                displayText: displayText || null,
              };
            }
          } catch (error) {
            console.warn('Error parsing templateVariableButton span:', error);
          }
          return false;
        },
      },
      {
        tag: 'a.badgeVariable',
        priority: 90,
        getAttrs: (dom) => {
          try {
            if (!dom || typeof dom !== 'object') return false;
            const element = dom as HTMLElement;
            if (!element || !element.getAttribute) return false;
            
            const marker = element.getAttribute('data-marker');
            const title = element.getAttribute('data-title') || element.textContent?.trim();
            const displayText = element.getAttribute('data-display-text');
            
            if (marker && title) {
              return {
                marker: marker,
                title: title,
                displayText: displayText || null,
              };
            }
          } catch (error) {
            console.warn('Error parsing badgeVariable anchor:', error);
          }
          return false;
        },
      },
      {
        tag: 'span.badgeVariable',
        priority: 85,
        getAttrs: (dom) => {
          try {
            if (!dom || typeof dom !== 'object') return false;
            const element = dom as HTMLElement;
            if (!element || !element.getAttribute) return false;
            
            const marker = element.getAttribute('data-marker');
            const title = element.getAttribute('data-title') || element.textContent?.trim();
            const displayText = element.getAttribute('data-display-text');
            
            if (marker && title) {
              return {
                marker: marker,
                title: title,
                displayText: displayText || null,
              };
            }
          } catch (error) {
            console.warn('Error parsing badgeVariable span:', error);
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { marker, title, displayText } = node.attrs;
    
    // Check if this is a link-type variable (contains "link" in title or marker)
    const isLinkVariable = (title && title.toLowerCase().includes('link')) || 
                          (marker && marker.toLowerCase().includes('link'));
    
    // Match QuillEditor format: ALL variables use class="badgeVariable" with data-marker and data-title
    // This ensures backend can process them correctly
    if (isLinkVariable) {
      // Link variables: render as span (backend will convert to <a> tag)
      // Match QuillEditor's exact format
      const buttonText = displayText || title || marker;
      return [
        'span',
        {
          'class': 'badgeVariable',
          'data-marker': marker,
          'data-title': title,
          'data-display-text': displayText || null,
          'data-node-type': 'templateVariableButton',
          'style': 'display: inline-block; padding: 8px 16px; background-color: #5048ED; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-family: Inter, sans-serif; font-weight: 500; font-size: 13px; margin: 0 4px; cursor: pointer;',
        },
        buttonText,
      ];
    }
    
    // For non-link variables: use same format as QuillEditor
    // All variables must have class="badgeVariable" for backend processing
    return [
      'span',
      {
        'class': 'badgeVariable',
        'data-marker': marker,
        'data-title': title,
        'data-display-text': displayText || null,
        'data-node-type': 'templateVariableButton',
      },
      title || marker, // innerHTML is the title (matching QuillEditor)
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateVariableButtonComponent);
  },

  addCommands() {
    return {
      setTemplateVariableButton:
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