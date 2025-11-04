import { GiHamburgerMenu } from "react-icons/gi";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button";
import Link from "next/link";
import Search from "./Search";

export default function Topbar() {
    return (
        <div className="p-3 sticky top-0 z-50 bg-[var(--color-background)] flex flex-row gap-5 h-[var(--topBarHeight)]">
            <Sheet>
                <SheetTrigger asChild className="cursor-pointer w-fit">
                    <Button variant="outline">
                        <GiHamburgerMenu className="w-auto h-full" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-fit p-5 gap-3">
                    <SheetHeader className="py-1 mt-3">
                        <SheetTitle>Where to Not have go</SheetTitle>
                    </SheetHeader>
                    <hr />
                    <div className="grid flex-1 auto-rows-min gap-3 px-4 *:text-[var(--color-foreground)] *:font-bold *:uppercase">
                        <SheetClose asChild>
                            <Link href="/">
                                Home
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/settings">
                                Settings
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/albums">
                                Albums
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/inline">
                                Inline
                            </Link>
                        </SheetClose>
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

