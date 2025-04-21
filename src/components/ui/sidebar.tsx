
"use client"

import * as React from "react"
import { ChevronRight, Menu, X } from "lucide-react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetPortal,
  SheetTrigger,
} from "@/components/ui/sheet"

type SidebarState = {
  open: boolean
  mobile: boolean
  setOpen: (open: boolean) => void
}

type SidebarStore = {
  sidebar: SidebarState
  setSidebar: (sidebar: Partial<SidebarState>) => void
}

const SidebarContext = React.createContext<SidebarStore | null>(null)

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [sidebar, setSidebar] = React.useState<SidebarState>({
    open: true,
    mobile: false,
    setOpen: (open) => setSidebar({ open }),
  })

  return (
    <SidebarContext.Provider value={{ sidebar, setSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }

  return context
}

export const Sidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  const { sidebar, setSidebar } = useSidebar()
  const [client, setClient] = React.useState(false)
  const [open, setOpen] = React.useState(sidebar.open)

  React.useEffect(() => setClient(true), [])
  React.useEffect(() => setOpen(sidebar.open), [sidebar.open])

  function handleWindowResize() {
    setSidebar({ mobile: window.matchMedia("(max-width: 640px)").matches })
  }

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize)

    handleWindowResize()

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(sidebar.open)
    }, 200)

    return () => clearTimeout(timer)
  }, [sidebar.open])

  const [style, setStyle] = React.useState<React.CSSProperties>({
    width: sidebar.open ? (sidebar.mobile ? "100%" : "16rem") : "0px",
    visibility: sidebar.open ? "visible" : "hidden",
    position: sidebar.mobile ? "fixed" : "sticky",
    zIndex: sidebar.mobile ? 50 : undefined,
  })

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStyle({
        width: sidebar.open ? (sidebar.mobile ? "100%" : "16rem") : "0px",
        visibility: sidebar.open ? "visible" : "hidden",
        position: sidebar.mobile ? "fixed" : "sticky",
        zIndex: sidebar.mobile ? 50 : undefined,
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [sidebar.open, sidebar.mobile])

  if (!client) {
    return null
  }

  if (sidebar.mobile) {
    return (
      <Sheet open={sidebar.open} onOpenChange={sidebar.setOpen}>
        <SheetContent
          side="left"
          className={cn(
            "inset-y-0 flex h-full flex-col overflow-hidden bg-white p-0 px-0 shadow-xl",
            className
          )}
          style={{
            maxWidth: "100%",
            width: sidebar.mobile ? "100%" : "16rem",
          }}
        >
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex h-16 items-center bg-white px-6">
              <X
                className="h-6 w-6 cursor-pointer"
                onClick={() => sidebar.setOpen(false)}
              />
            </div>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav
      className={cn("border-r bg-white shadow-sm", className)}
      ref={ref}
      style={style}
      {...props}
    >
      <div className="flex h-full flex-col overflow-hidden">{children}</div>
    </nav>
  )
})
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border-b bg-white", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col overflow-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border-t bg-white", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"

const sidebarGroupVariants = cva("", {
  variants: {
    border: {
      top: "border-t",
      bottom: "border-b",
      both: "border-t border-b",
      none: "",
    },
  },
  defaultVariants: {
    border: "none",
  },
})

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    border?: "top" | "bottom" | "both" | "none"
  }
>(({ className, border, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(sidebarGroupVariants({ border }), className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("py-2 pl-6 pr-3 text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, children, ...props }, ref) => {
  return (
    <ul ref={ref} className={className} {...props}>
      {children}
    </ul>
  )
})
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => {
  return (
    <li ref={ref} className={className} {...props}>
      {children}
    </li>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }
>(({ className, children, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 py-2 pl-6 pr-3 text-sm text-gray-800 transition-colors hover:bg-gray-50 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarTrigger = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  const { sidebar } = useSidebar()

  if (sidebar.open || sidebar.mobile) {
    return null
  }

  return (
    <button
      className={cn("flex items-center justify-center", className)}
      onClick={() => sidebar.setOpen(!sidebar.open)}
    >
      {children ?? <Menu className="h-6 w-6" />}
    </button>
  )
}
