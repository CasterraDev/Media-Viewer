import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button";
import Link from "next/link";
import Search from "./Search";

export default function Topbar() {

    return (
        <div className="p-3 sticky top-0 z-50 bg-[var(--color-background)] flex flex-row gap-5">
            <Sheet>
                <SheetTrigger asChild className="cursor-pointer w-fit">
                    <Button variant="outline">
                        <GiHamburgerMenu className="w-auto h-full" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-fit p-5">
                    <SheetHeader>
                        <SheetTitle>Where to go</SheetTitle>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-3 px-4">
                        <Link href="/">
                            Home
                        </Link>
                        <Link href="/settings">
                            Settings
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
            <div className="grow" />
            <div className="grow max-w-1/2">
                <Search />
            </div>
        </div>
    )
}

