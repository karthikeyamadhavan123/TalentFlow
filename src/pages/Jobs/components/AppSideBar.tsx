import { ChevronUp, User2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useTheme } from "@/context/ThemeContext"
import { Link } from "react-router-dom"
import hrNavItems from "@/utils/data"

function AppSidebar() {
  const { isDark } = useTheme()
  const { open } = useSidebar()

  const username = JSON.parse(localStorage.getItem("currentUser") || "{}")?.name || "Username"

  const avatar = JSON.parse(localStorage.getItem("currentUser") || "{}")?.avatar || "👤"
  if (!open) return null
  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
    >
      {/* Sidebar Header with custom styling */}
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-purple-600/30">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark
            ? "bg-linear-to-r from-cyan-400 to-blue-500"
            : "bg-linear-to-r from-purple-600 to-pink-600"
            }`}>
            <span className="text-white font-bold text-sm">TF</span>
          </div>
          {open && (
            <span className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"
              }`}>
              TalentFlow
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* Main Content Area */}
      <SidebarContent className="flex-1 py-4">
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className={`font-semibold text-xs uppercase tracking-wider px-4 ${isDark ? "text-purple-200/80" : "text-gray-600"
              }`}>
              Important Links
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {hrNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`transition-all duration-200 mx-2 rounded-lg flex items-center ${open
                      ? "px-3 py-2.5 gap-3 justify-start"
                      : "p-2 justify-center"
                      } ${isDark
                        ? "text-purple-100 hover:bg-linear-to-r hover:from-cyan-400/20 hover:to-blue-500/20 hover:text-white data-[state=open]:bg-linear-to-r data-[state=open]:from-cyan-400/30 data-[state=open]:to-blue-500/30 data-[state=open]:text-white"
                        : "text-gray-700 hover:bg-linear-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:text-purple-700 data-[state=open]:bg-linear-to-r data-[state=open]:from-purple-600/30 data-[state=open]:to-pink-600/30 data-[state=open]:text-purple-900"
                      }`}
                  >
                    <Link to={item.url} className="flex items-center w-full justify-center sm:justify-start">
                      <item.icon className="w-5 h-5 shrink-0" />
                      {open && <span className="font-medium ml-3 truncate">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer fixed at bottom */}
      <SidebarFooter className="p-2 border-t border-gray-200 dark:border-purple-600/30 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className={`w-full transition-all duration-200 rounded-lg flex items-center ${open ? "px-3 py-2 gap-3" : "p-2 justify-center"
                  } ${isDark
                    ? "text-purple-100 hover:bg-linear-to-r hover:from-cyan-400/20 hover:to-blue-500/20 hover:text-white data-[state=open]:bg-linear-to-r data-[state=open]:from-cyan-400/30 data-[state=open]:to-blue-500/30 data-[state=open]:text-white"
                    : "text-gray-700 hover:bg-linear-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:text-purple-700 data-[state=open]:bg-linear-to-r data-[state=open]:from-purple-600/30 data-[state=open]:to-pink-600/30 data-[state=open]:text-purple-900"
                  }`}>
                  <div className={`flex items-center ${open ? "gap-3 w-full" : "justify-center"
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDark
                      ? "bg-linear-to-r from-cyan-400 to-blue-500"
                      : "bg-linear-to-r from-purple-600 to-pink-600"
                      }`}>
                      {avatar ? avatar : <User2 className="w-4 h-4 text-white" />}
                    </div>
                    {open && (
                      <>
                        <span className="font-medium flex-1 text-left truncate">{username}</span>
                        <ChevronUp className="w-4 h-4 transition-transform duration-200 shrink-0" />
                      </>
                    )}
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className={`w-[--radix-popper-anchor-width] min-w-[180px] border rounded-lg shadow-lg backdrop-blur-sm p-1 ${isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                <DropdownMenuItem className={`cursor-pointer rounded-md px-3 py-2 transition-colors duration-200 ${isDark
                  ? "text-gray-100 hover:bg-cyan-500/50 hover:text-white focus:bg-cyan-500/50 focus:text-white"
                  : "text-gray-700 hover:bg-purple-500/50 hover:text-white focus:bg-purple-500/50 focus:text-white"
                  }`}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className={`cursor-pointer rounded-md px-3 py-2 transition-colors duration-200 ${isDark
                  ? "text-gray-100 hover:bg-red-500/50 hover:text-white focus:bg-red-500/50 focus:text-white"
                  : "text-gray-700 hover:bg-red-500/50 hover:text-white focus:bg-red-500/50 focus:text-white"
                  }`}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

