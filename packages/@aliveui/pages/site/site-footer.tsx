"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@aliveui/ui"

export function SiteFooter() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <footer className="bg-sidebar h-[10px] sticky bottom-0 z-50 flex w-full items-center  h-1">
      <div className="flex w-full items-center gap-2 px-4">
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1
              const href = `/${segments.slice(0, index + 1).join("/")}`
              const title = segment.charAt(0).toUpperCase() + segment.slice(1)

              return (
                <div key={href} className="flex items-center">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </div>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </footer>
  )
}
