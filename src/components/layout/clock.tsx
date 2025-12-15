"use client";

import { useEffect, useState } from "react";

export function Clock() {
     const [time, setTime] = useState<Date | null>(null);

     useEffect(() => {
          const timeout = setTimeout(() => setTime(new Date()), 0);

          const interval = setInterval(() => {
               setTime(new Date());
          }, 1000);

          return () => {
               clearInterval(interval);
               clearTimeout(timeout);
          };
     }, []);

     if (!time) return null;

     return (
          <div className="hidden md:flex flex-col items-end mr-4">
               <span className="text-sm font-medium">
                    {time.toLocaleDateString("id-ID", {
                         weekday: "long",
                         day: "numeric",
                         month: "long",
                         year: "numeric",
                    })}
               </span>
               <span className="text-xs text-muted-foreground font-mono">
                    {time.toLocaleTimeString("id-ID", {
                         hour: "2-digit",
                         minute: "2-digit",
                         second: "2-digit",
                    })} WIB
               </span>
          </div>
     );
}
