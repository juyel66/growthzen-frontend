'use client';

import React, { useState } from 'react';
import { Control, useFieldArray, UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { Layers, Plus, Trash2, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttributeManagerProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const AttributeManager: React.FC<AttributeManagerProps> = ({
  control,
  register,
  errors,
}) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'attributes',
  });

  const [tagInputValues, setTagInputValues] = useState<Record<number, string>>({});

  const handleAddAttribute = () => {
    append({ name: '', values: [] });
  };

  const handleAddValueTag = (index: number) => {
    const rawVal = tagInputValues[index]?.trim();
    if (!rawVal) return;

    const currentAttr = fields[index];
    const currentValues = currentAttr?.values || [];
    if (!currentValues.includes(rawVal)) {
      const updatedValues = [...currentValues, rawVal];
      update(index, { ...currentAttr, values: updatedValues });
    }
    setTagInputValues({ ...tagInputValues, [index]: '' });
  };

  const handleRemoveValueTag = (attrIndex: number, valIndex: number) => {
    const currentAttr = fields[attrIndex];
    const updatedValues = (currentAttr?.values || []).filter((_, i) => i !== valIndex);
    update(attrIndex, { ...currentAttr, values: updatedValues });
  };

  return (
    <div className="flex flex-col gap-5 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Dynamic Product Attributes & Specifications
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add custom specifications (e.g., Colour, RAM, Material, Fabric, Storage, Processor). Supports unlimited attributes.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddAttribute}
          className="cursor-pointer font-bold"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Attribute
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-400">
          No attributes added yet. Click &quot;Add Attribute&quot; to define specifications for Fashion, Electronics, Grocery, etc.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-3 relative"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Attribute Name Input */}
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Attribute Name *
                  </label>
                  <input
                    type="text"
                    {...register(`attributes.${index}.name` as const)}
                    placeholder="e.g. Colour, Material, Fabric, RAM, Storage"
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                {/* Remove Attribute Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer self-end mb-0.5"
                  title="Remove attribute"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Attribute Values Tag Manager */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Attribute Values (e.g. Black, White, Blue / 8GB, 16GB) *
                </label>

                {/* Tag List */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[42px]">
                  {field.values &&
                    field.values.map((val, vIdx) => (
                      <span
                        key={vIdx}
                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800"
                      >
                        {val}
                        <button
                          type="button"
                          onClick={() => handleRemoveValueTag(index, vIdx)}
                          className="hover:text-rose-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                  <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={tagInputValues[index] || ''}
                      onChange={(e) => setTagInputValues({ ...tagInputValues, [index]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddValueTag(index);
                        }
                      }}
                      placeholder="Type value and press Enter..."
                      className="w-full text-xs font-medium bg-transparent focus:outline-none px-1 text-slate-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddValueTag(index)}
                      className="p-1 text-xs bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {errors.attributes?.[index] && (
                <span className="text-xs font-semibold text-rose-500">
                  Please enter both attribute name and at least one value.
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttributeManager;

