import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <div className="flex min-h-screen w-full flex-col md:flex-row bg-muted/40 dark:bg-zinc-950">
               <Sidebar />
               <div className="flex flex-col flex-1 h-screen overflow-hidden">
                    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-15 lg:px-6 justify-between md:justify-end">
                         <MobileSidebar />
                         <ModeToggle />
                    </header>
                    <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto py-8">
                         <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
                              {children}
                         </div>
                    </main>
               </div>
          </div>
     );
}
