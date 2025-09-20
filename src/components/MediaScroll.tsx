"use client"

import { Media } from "@/db/types"
import { useEffect, useState } from "react"
import MediaShow from "./MediaShow"
import { getMedias } from "@/actions/getMedia"
import { useInView } from "react-intersection-observer"

export default function MediaScroll() {
    const [medias, setMedias] = useState<Media[]>([])
    const [offset, setOffset] = useState<number>(0)
    const [finished, setFinished] = useState<boolean>(false)
    const { ref, inView } = useInView()

    async function loadMoreMedias() {
        const apiMedias = await getMedias(offset, 10)
        if (apiMedias.length <= 0){
            setFinished(true);
            return
        }
        setMedias(medias => [...medias, ...apiMedias])
        setOffset(offset => offset + 10)
    }

    useEffect(() => {
        if (inView && !finished) {
            loadMoreMedias()
        }
    }, [inView])

    return (
        <div>
            <div className="grid grid-cols-4">
                {medias.map((m) => (
                    <div key={m.id}>
                        <MediaShow media={m} />
                    </div>
                ))}
            </div>
            {!finished &&
            <div className="flex justify-center">
                <div ref={ref} className="p-5 border-1 rounded-lg">Loading...</div>
            </div>
            }
        </div>
    )
}

