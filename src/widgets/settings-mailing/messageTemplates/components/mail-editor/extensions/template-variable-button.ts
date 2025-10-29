import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateVariableButtonComponent } from './template-variable-button-component';

export interface TemplateVariableButtonOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    templateVariableButton: {
      setTemplateVariableButton: (options: { marker: string; title: string }) => ReturnType;
    };
  }
}

export const TemplateVariableButton = Node.create<TemplateVariableButtonOptions>({
  name: 'templateVariableButton',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  draggable: false,

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
      {
        tag: 'a[data-node-type="templateVariableButton"]',
        priority: 100,
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          const marker = element.getAttribute('data-marker');
          const title = element.getAttribute('data-title') || element.textContent?.trim();
          
          console.log('Parsing anchor templateVariableButton:', { marker, title });
          
          if (marker && title) {
            return {
              marker: marker,
              title: title,
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
          
          console.log('Parsing span templateVariableButton:', { marker, title });
          
          if (marker && title) {
            return {
              marker: marker,
              title: title,
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
          
          console.log('Parsing anchor badgeVariable:', { marker, title });
          
          if (marker && title) {
            return {
              marker: marker,
              title: title,
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
          
          console.log('Parsing span badgeVariable:', { marker, title });
          
          if (marker && title) {
            return {
              marker: marker,
              title: title,
            };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { marker, title } = node.attrs;
    
    // Check if this is a link-type variable (contains "link" in title or marker)
    const isLinkVariable = (title && title.toLowerCase().includes('link')) || 
                          (marker && marker.toLowerCase().includes('link'));
    
    // CRITICAL FIX: For link variables, render as an actual <a> tag, not a <span>
    // This ensures email clients properly display them as clickable links
    if (isLinkVariable) {
      // Link variables: render as anchor tag with button styling
      return [
        'a',
        {
          'href': marker, // Use marker as the actual href for email clients
          'data-marker': marker,
          'data-title': marker,
          'data-node-type': 'templateVariableButton',
          'class': 'badgeVariable',
          'style': 'display: inline-block; padding: 8px 16px; background-color: #5048ED; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-family: Inter, sans-serif; font-weight: 500; font-size: 13px; margin: 0 4px; cursor: pointer;',
          'target': '_blank',
          'rel': 'noopener noreferrer',
        },
        marker, // Display text is the title (what user sees)
      ];
    }
    
    // For non-link variables (template variables): gray badge styling as span
    return [
      'span',
      {
        'class': 'badgeVariable',
        'data-marker': marker,
        'data-title': title,
        'data-node-type': 'templateVariableButton',
        'style': 'display: inline-block; padding: 4px 10px; background-color: #f0f0f0; color: #333333; border-radius: 4px; font-family: Inter, sans-serif; font-weight: 500; font-size: 13px; margin: 0 2px;',
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