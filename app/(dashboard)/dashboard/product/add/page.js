"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import AddProduct from "@/components/dashboard/Product/Add-Product";

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
                            <BreadcrumbLink
                                href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="md:block"/>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/dashboard/product">Product</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="md:block"/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Add Product</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Separator orientation="vertical" className="mr-2 h-4"/>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                </div>
                <AddProduct/>
                <div
                    className="flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
            </div>
        </SidebarInset>
    );
}
