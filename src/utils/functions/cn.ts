/**
 * Utility function to merge Tailwind CSS classes
 * Combines multiple class names and filters out falsy values
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
    return inputs.filter(Boolean).join(' ')
}
