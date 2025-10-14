import AlbumPage from "@/components/AlbumPage"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <div>
            <AlbumPage id={id} />
        </div>
    )
}
