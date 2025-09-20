import MediaScroll from "@/components/MediaScroll";
import MediaShow from "@/components/MediaShow";
import UploadBtn from "@/components/UploadBtn";

export default function Home() {
    return (
        <div className="flex flex-col">
            <div className="w-28 p-5 rounded-lg border-2">
                <UploadBtn />
            </div>
            <MediaScroll />
        </div>
    );
}
