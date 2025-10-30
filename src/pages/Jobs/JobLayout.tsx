import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import JobBoard from "./JobBoard"
import AppSidebar from "./components/AppSideBar"

const JobLayout = () => {
  const { isDark } = useTheme()


  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDark ? "dark bg-gray-900" : "bg-background"}`}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top trigger for mobile */}
          <div className="p-4 flex items-center gap-2">
            <SidebarTrigger
            >
              <Menu className="w-5 h-5" />
              <span>Menu</span>
            </SidebarTrigger>
          </div>

          <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
            <JobBoard />
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default JobLayout
