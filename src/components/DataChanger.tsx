"use client"

import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { FormEvent } from "react"
import { changeData } from "@/actions/changeData";
import { Button } from "./ui/button";

export default function DataChanger({
    className,
    ...props
}: React.ComponentProps<"div">) {

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        await changeData(fd);
    }

    return (
        <div {...props}
            className={cn(className, "w-full h-full")}>
            <h1 className="text-2xl underline">Data Changer</h1>
            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="flex flex-col">
                    <label htmlFor="mediaRoot" className="flex flex-row gap-5 items-center">Match Root<p className="text-center my-auto text-xs text-gray-200">End with a /</p></label>
                    <Input id="mediaRoot" name="mediaRoot" type="text" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="mediaDir" className="flex flex-row gap-5 items-center">Match Dir<p className="text-center my-auto text-xs text-gray-200">End with a /</p></label>
                    <Input id="mediaDir" name="mediaDir" type="text" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="mediaFilename">Match Filename</label>
                    <Input id="mediaFilename" name="mediaFilename" type="text" />
                </div>

                <p>Use % as wildcard and {'{old}'} to paste the 'Match' value</p>
                <div className="flex flex-col">
                    <label htmlFor="mediaRoot-change" className="flex flex-row gap-5 items-center">Replace Root<p className="text-center my-auto text-xs text-gray-200">'Variables' do not have / at the begining or end. End with a /</p></label>
                    <Input id="mediaRoot-change" name="mediaRoot-change" type="text" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="mediaDir-change" className="flex flex-row gap-5 items-center">Replace Dir<p className="text-center my-auto text-xs text-gray-200">'Variables' do not have / at the begining or end. End with a /</p></label>
                    <Input id="mediaDir-change" name="mediaDir-change" type="text" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="mediaFilename-change">Replace Filename</label>
                    <Input id="mediaFilename-change" name="mediaFilename-change" type="text" />
                </div>
                <Button type="submit">Change Data</Button>
            </form>
        </div>
    )
}

