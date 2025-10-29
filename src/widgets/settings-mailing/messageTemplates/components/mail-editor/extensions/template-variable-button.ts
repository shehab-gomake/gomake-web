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
          const element = dom as HTMLElement;
          const marker = element.getAttribute('data-marker');
          const title = element.getAttribute('data-title') || element.textContent?.trim();
          const displayText = element.getAttribute('data-display-text');
          
          console.log('Parsing anchor templateVariableButton:', { marker, title, displayText });
          
          if (marker && title) {
            return {
              marker: marker,
              title: title,
              displayText: displayText || null,
            };
          }
          return false;
        },
      },
      {
        tag: 'span[data-node-type="templateVariableButton"]',
        priority: 95,
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          const marker = element.getAttribute('data-marker');
          const title = element.getAttribute('data-title') || element.textContent?.trim();
          const displayText = element.getAttribute('data-display-text');
          
          console.log('Parsing span templateVariableButton:', { marker, title, displayText });
          
          if (marker && title) {
            return {
              marker: marker,
              title: title,
              displayText: displayText || null,
            };
          }
          return false;
        },
      },
      {
        tag: 'a.badgeVariable',
        priority: 90,
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          const marker = element.getAttribute('data-marker');
          const title = element.getAttribute('data-title') || element.textContent?.trim();
          const displayText = element.getAttribute('data-display-text');
          
          console.log('Parsing anchor badgeVariable:', { marker, title, displayText });
          
          if (marker && title) {
            return {
              marker: marker,
              title: title,
              displayText: displayText || null,
            };
          }
          return false;
        },
      },
      {
        tag: 'span.badgeVariable',
        priority: 85,
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          const marker = element.getAttribute('data-marker');
          const title = element.getAttribute('data-title') || element.textContent?.trim();
          const displayText = element.getAttribute('data-display-text');
          
          console.log('Parsing span badgeVariable:', { marker, title, displayText });
          
          if (marker && title) {
            return {
              marker: marker,
              title: title,
              displayText: displayText || null,
            };
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
    
    // CRITICAL FIX: For link variables, render as an actual <a> tag, not a <span>
    // This ensures email clients properly display them as clickable links
    if (isLinkVariable) {
      // Link variables: render as anchor tag with button styling
      const buttonText = displayText || title || marker;
      return [
        'a',
        {
          'href': marker, // Use marker as the actual href for email clients
          'data-marker': marker,
          'data-title': title,
          'data-display-text': displayText,
          'data-node-type': 'templateVariableButton',
          'class': 'badgeVariable',
          'style': 'display: inline-block; padding: 8px 16px; background-color: #5048ED; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-family: Inter, sans-serif; font-weight: 500; font-size: 13px; margin: 0 4px; cursor: pointer;',
          'target': '_blank',
          'rel': 'noopener noreferrer',
        },
        buttonText, // Display text is customizable
      ];
    }
    
    // For non-link variables (template variables): render as plain text
    return [
      'span',
      {
        'class': 'templateVariable',
        'data-marker': marker,
        'data-title': title,
        'data-node-type': 'templateVariableButton',
        'style': 'font-family: Inter, sans-serif; font-weight: 400; font-size: 14px; color: #666666;',
      },
      title, // innerHTML is the title
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