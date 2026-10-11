import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          `
          flex min-h-[80px] w-full rounded-md 
          border border-[var(--input-border,rgba(0,0,0,0.1))] 
          bg-[var(--background)] 
          text-[var(--foreground)] 
          placeholder:text-[var(--muted-foreground)] 
          ring-offset-[var(--background)] 
          px-3 py-2 text-base 
          transition-all duration-200 
          focus-visible:outline-none 
          focus-visible:ring-2 
          focus-visible:ring-[var(--ring,#3b82f6)] 
          focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50 
          md:text-sm

          dark:border-[var(--primaryBorder)]
          dark:bg-[var(--primaryCardLight)]
          dark:text-[var(--foreground)]
          dark:placeholder:text-[var(--muted-foreground)]
          dark:ring-offset-[var(--background)]
          `,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
