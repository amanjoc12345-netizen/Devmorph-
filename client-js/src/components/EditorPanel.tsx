'use client';

import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface SelectedElement {
  tagName: string;
  text?: string;
  href?: string;
  src?: string;
  className?: string;
  styles?: Record<string, any>;
}

interface EditorPanelProps {
  selectedElement: SelectedElement | null;
  onUpdate: (updates: Record<string, any>) => void;
  onClose: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ selectedElement, onUpdate, onClose }) => {
  const [values, setValues] = useState<SelectedElement | null>(selectedElement);

  useEffect(() => {
    setValues(selectedElement);
  }, [selectedElement]);

  if (!selectedElement || !values) return null;

  const handleChange = (field: string, value: any) => {
    const newValues: SelectedElement = { ...values, [field]: value };

    if (values.styles && field in values.styles) {
      newValues.styles = { ...values.styles, [field]: value };
    }

    setValues(newValues);
    onUpdate({ [field]: value });
  };

  const handleStyleChange = (styleName: string, value: any) => {
    const newStyles = { ...(values.styles || {}), [styleName]: value };
    setValues({ ...values, styles: newStyles });
    onUpdate({ styles: { [styleName]: value } });
  };

  const currentStyles = values.styles || {};

  return (
    <div
      className="
        absolute top-4 right-4 w-80 z-50
        rounded-2xl
        bg-white/10 backdrop-blur-xl
        border border-white/15
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        p-5
        animate-fade-in
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Edit '{selectedElement.tagName.toLowerCase()}' Element
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-5 text-white">
        {/* Text Content (if not <img>) */}
        {selectedElement.tagName.toLowerCase() !== 'img' && (
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">
              Text Content
            </label>
            <textarea
              value={values.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className="
                w-full min-h-20 text-sm
                bg-black/40 border border-white/15
                rounded-lg p-2.5 text-white
                outline-none focus:ring-2 focus:ring-lime-400/60
              "
            />
          </div>
        )}

        {/* Link (if <a>) */}
        {selectedElement.tagName.toLowerCase() === 'a' && (
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">
              Link (URL)
            </label>
            <input
              type="text"
              value={values.href || ''}
              onChange={(e) => handleChange('href', e.target.value)}
              className="
                w-full text-sm
                bg-black/40 border border-white/15
                rounded-lg p-2.5 text-white
                outline-none focus:ring-2 focus:ring-lime-400/60
              "
            />
          </div>
        )}

        {/* Image Source (if <img>) */}
        {selectedElement.tagName.toLowerCase() === 'img' && (
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">
              Image Source (URL)
            </label>
            <input
              type="text"
              value={values.src || ''}
              onChange={(e) => handleChange('src', e.target.value)}
              className="
                w-full text-sm
                bg-black/40 border border-white/15
                rounded-lg p-2.5 text-white
                outline-none focus:ring-2 focus:ring-lime-400/60
              "
            />
          </div>
        )}

        {/* ClassName */}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1">
            ClassName
          </label>
          <input
            type="text"
            value={values.className || ''}
            onChange={(e) => handleChange('className', e.target.value)}
            className="
              w-full text-sm
              bg-black/40 border border-white/15
              rounded-lg p-2.5 text-white
              outline-none focus:ring-2 focus:ring-lime-400/60
            "
          />
        </div>

        {/* Layout / Display */}
        <div>
          <label className="block text-[11px] text-white/40 mb-1">
            Display
          </label>
          <select
            value={currentStyles.display || 'block'}
            onChange={(e) =>
              handleStyleChange('display', e.target.value)
            }
            className="
              w-full text-sm
              bg-black/40 border border-white/15
              rounded-lg p-2 text-white
              outline-none focus:ring-2 focus:ring-lime-400/60
            "
          >
            <option value="block">block</option>
            <option value="inline">inline</option>
            <option value="inline-block">inline-block</option>
            <option value="flex">flex</option>
            <option value="grid">grid</option>
            <option value="none">none</option>
          </select>
        </div>

        {/* Spacing */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-white/40 mb-1">
              Padding
            </label>
            <input
              type="text"
              value={currentStyles.padding || ''}
              onChange={(e) =>
                handleStyleChange('padding', e.target.value)
              }
              className="
                w-full text-sm bg-black/40
                border border-white/15
                rounded-lg p-2 text-white
              "
            />
          </div>
          <div>
            <label className="block text-[11px] text-white/40 mb-1">
              Margin
            </label>
            <input
              type="text"
              value={currentStyles.margin || ''}
              onChange={(e) =>
                handleStyleChange('margin', e.target.value)
              }
              className="
                w-full text-sm bg-black/40
                border border-white/15
                rounded-lg p-2 text-white
              "
            />
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-white/40 mb-1">
              Background
            </label>
            <div className="flex items-center gap-2 border border-white/15 rounded-lg p-1.5 bg-black/30">
              <input
                type="color"
                value={
                  !currentStyles.backgroundColor || currentStyles.backgroundColor === 'rgba(0, 0, 0, 0)'
                    ? '#ffffff'
                    : currentStyles.backgroundColor
                }
                onChange={(e) =>
                  handleStyleChange('backgroundColor', e.target.value)
                }
                className="w-6 h-6 cursor-pointer rounded"
              />
              <span className="text-[11px] text-white/50 truncate">
                {currentStyles.backgroundColor || 'default'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-white/40 mb-1">
              Text
            </label>
            <div className="flex items-center gap-2 border border-white/15 rounded-lg p-1.5 bg-black/30">
              <input
                type="color"
                value={currentStyles.color || '#ffffff'}
                onChange={(e) =>
                  handleStyleChange('color', e.target.value)
                }
                className="w-6 h-6 cursor-pointer rounded"
              />
              <span className="text-[11px] text-white/50 truncate">
                {currentStyles.color || 'default'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
