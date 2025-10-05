"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useUserPrefs from "@/hooks/useUserPrefs"
import { XIcon } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import UploadBtn from "./UploadBtn";
import DataChanger from "./DataChanger";

export default function Settings() {
    const [roots, setRoots] = useState<string[]>([])
    const { userPrefs: settings, updateUserPrefs: setSettings } = useUserPrefs("settings");
    const newRootRef = useRef<HTMLInputElement>(null)

    function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log(formData.get("newRoot"));
        let newRoots: string[] = []
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
            const st = pair[1].toString()
            if (pair[0].toString().includes("root") && st !== ""){
                newRoots.push(st)
            }
        }
        setSettings({mediaRoots: newRoots})
    }

    function remove(i: number){
        let r = roots;
        r.splice(i, 1);
        setSettings({mediaRoots: r});
    }

    useEffect(() => {
        setRoots(settings.mediaRoots);
        if (newRootRef.current){
            newRootRef.current.value = "";
        }
    }, [settings])

    return (
        <div className="p-5 flex flex-col gap-3 mx-20">
            <form className="flex flex-col gap-3" onSubmit={save}>
                <label className="text-lg">Media Roots</label>
                {roots.map((r: string, i: number) => (
                    <div className="flex flex-row gap-3" key={i}>
                        <Input placeholder={r} defaultValue={r} name={`root-${i}`}/>
                        <Button type="button" className="cursor-pointer" onClick={() => remove(i)}><XIcon /></Button>
                    </div>
                ))}
                <Input placeholder="New Root" name="root-new" ref={newRootRef} />
                <Button type="submit" className="w-fit p-2 ml-auto">Save</Button>
            </form>

            <div className="w-fit h-auto ml-auto">
                <UploadBtn roots={settings.mediaRoots}/>
            </div>

            <DataChanger />
        </div>
    )
}

