"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import DressShowcase from "@/components/dashboard/Product/ProductShowcase";

export default function Page() {
    return (
        <SidebarInset>
            <header
                className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="md:block">
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Separator orientation="vertical" className="mr-2 h-4"/>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                </div>
                <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
                <DressShowcase/>
            </div>
        </SidebarInset>
    );
}