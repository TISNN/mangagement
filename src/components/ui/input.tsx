import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, id, name, ...props }, ref) => {
    // 确保每个输入框都有id和name属性
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const inputName = name || inputId;

    return (
      <input
        type={type}
        id={inputId}
        name={inputName}
        className={`
          flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm
          ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium
          placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed
          disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-950
          dark:placeholder:text-gray-400 dark:focus-visible:ring-indigo-400
          ${className}
        `}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }