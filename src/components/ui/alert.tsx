import * as React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success";
  className?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "default", className = "", ...props }, ref) => {
    const variantClassNames = {
      default: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      destructive: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800",
      success: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800"
    };
    
    return (
      <div
        ref={ref}
        className={`relative w-full rounded-lg border p-4 ${variantClassNames[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm ${className}`}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };