'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  isEdit?: boolean;
  label?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, disabled, isEdit, label }) => {
  const defaultLabel = isEdit
    ? (isLoading ? 'Updating Product...' : 'Save Changes')
    : (isLoading ? 'Creating Product...' : 'Publish Product');

  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      isLoading={isLoading}
      disabled={disabled || isLoading}
      className="w-full sm:w-auto px-8 py-3 font-bold cursor-pointer shadow-md hover:shadow-lg transition-all"
    >
      {!isLoading && (
        isEdit ? <Save className="w-5 h-5 mr-2" /> : <PlusCircle className="w-5 h-5 mr-2" />
      )}
      {label || defaultLabel}
    </Button>
  );
};

export default SubmitButton;

