// utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Purpose: Provides a helper function, cn, to handle conditional class names efficiently when using clsx and tailwind-merge.
// clsx: A library that helps conditionally combine class names.
// Example:
// typescript
// Copy code
// clsx("btn", { "btn-primary": true, "btn-disabled": false })
// Result: "btn btn-primary".
// twMerge: A Tailwind utility that intelligently merges class names, especially for handling conflicts.
// Example:
// typescript
// Copy code
// twMerge("bg-red-500", "bg-blue-500")
// Result: "bg-blue-500" (last class wins).
// cn: Combines both clsx and twMerge to merge class names conditionally and resolve Tailwind conflicts.