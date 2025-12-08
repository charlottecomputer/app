import { cn } from "@aliveui"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "./card"
import { Icon, type IconName } from "./icon"
import { type ReactNode } from "react"

interface BentoCardProps extends React.ComponentProps<typeof Card> {
    title?: string
    icon?: IconName | string
    action?: ReactNode
    noBackground?: boolean
    children?: ReactNode
}

export function BentoCard({
    title,
    icon,
    action,
    noBackground,
    className,
    children,
    ...props
}: BentoCardProps) {
    return (
        <Card
            className={cn(
                "h-full",
                noBackground && "bg-transparent border-none shadow-none",
                className
            )}
            {...props}
        >
            {(title || icon || action) && (
                <CardHeader>
                    <div className="flex items-center gap-2">
                        {icon && <Icon icon={icon as IconName} className="h-5 w-5 text-muted-foreground" />}
                        {title && <CardTitle className="text-base font-medium">{title}</CardTitle>}
                    </div>
                    {action && <CardAction>{action}</CardAction>}
                </CardHeader>
            )}
            <CardContent className={cn("p-6", (title || icon || action) && "pt-0")}>
                {children}
            </CardContent>
        </Card>
    )
}
