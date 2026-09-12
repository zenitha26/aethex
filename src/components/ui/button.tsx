import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-xs font-mono tracking-widest uppercase transition-colors duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-black text-white hover:bg-neutral-800 font-medium border border-transparent rounded-none",
                outline: "bg-transparent text-black border border-gray-300 hover:border-black rounded-none relative group",
                link: "text-black underline-offset-4 hover:text-neutral-700 rounded-none",
            },
            size: {
                default: "h-14 px-8 py-4",
                sm: "h-10 px-6",
                lg: "h-16 px-12",
                icon: "h-14 w-14",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Inject the underline span dynamically for outline buttons if not using asChild
    if (variant === "outline" && !asChild) {
        return (
            <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
                <span className="relative z-10">{children}</span>
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-black transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            </Comp>
        )
    }

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>{children}</Comp>
})
Button.displayName = "Button"

export { Button, buttonVariants }