import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';

// React component for rendering the button
const TemplateVariableButtonComponent = (props: any) => {
  const { node } = props;

  return (
    <NodeViewWrapper
      as="span"
      style={{
        display: 'inline-block',
        margin: '0 2px',
      }}
    >
      <button
        contentEditable={false}
        style={{
          padding: '2px 8px',
          backgroundColor: '#5048ED',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {node.attrs.title || node.attrs.marker}
      </button>
    </NodeViewWrapper>
  );
};

export interface TemplateVariableButtonOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    templateVariableButton: {
      /**
       * Insert a template variable button
       */
      setTemplateVariableButton: (options: {
        marker: string;
        title: string;
      }) => ReturnType;
    };
  }
}

export const TemplateVariableButton = Node.create<TemplateVariableButtonOptions>({
  name: 'templateVariableButton',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      marker: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-marker'),
        renderHTML: (attributes) => {
          return {
            'data-marker': attributes.marker,
          };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-title'),
        renderHTML: (attributes) => {
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
        tag: 'span[data-type="template-variable-button"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-type': 'template-variable-button' }),
      HTMLAttributes.title || HTMLAttributes.marker,
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
