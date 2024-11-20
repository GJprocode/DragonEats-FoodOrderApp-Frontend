// Example: Create `frontend/src/components/ui/textarea.tsx`
import React from "react";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`border p-2 rounded ${className}`}
    {...props}
  />
));

Textarea.displayName = "Textarea";
