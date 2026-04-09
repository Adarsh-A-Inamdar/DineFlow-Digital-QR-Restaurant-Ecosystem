import { cn } from "../../lib/utils";

const Button = ({ className, variant = 'primary', isLoading, children, ...props }) => {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95 disabled:opacity-50",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 disabled:opacity-50",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95 disabled:opacity-50",
        ghost: "text-gray-600 hover:bg-gray-100 disabled:opacity-50",
        danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95 disabled:opacity-50"
    };

    return (
        <button 
            disabled={isLoading || props.disabled}
            className={cn(
                "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                </div>
            ) : children}
        </button>
    );
};

export default Button;
