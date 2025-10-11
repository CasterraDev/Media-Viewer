import MediaLoader from "@/components/MediaLoader";

export default function Home() {
    console.log("Home")
    return (
        <div className="flex flex-col">
            <MediaLoader sizeScale={.20} reset={true}/>
        </div>
    );
}
