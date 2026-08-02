'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, disabled }) => {
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      isLoading={isLoading}
      disabled={disabled || isLoading}
      className="w-full sm:w-auto px-8 py-3 font-bold cursor-pointer shadow-md hover:shadow-lg transition-all"
    >
      {!isLoading && <PlusCircle className="w-5 h-5 mr-2" />}
      {isLoading ? 'Creating Product...' : 'Publish Product'}
    </Button>
  );
};

export default SubmitButton;
