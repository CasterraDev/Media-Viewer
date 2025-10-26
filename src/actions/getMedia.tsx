'use server'

import { FilterPrimative } from "@/_types/type"
import { MediaAlbums } from "@/db/types";
import { filterSignal } from "@/utils/signals";

function pushDict(d: { [id: string]: any }, defaultVal: any, k: string, v: any) {
    if (!d[k]) {
        d[k] = defaultVal
    }
    d[k].push(v);
}

function parseSearch(s: string, d: { [id: string]: string | string[] }): { [id: string]: string | string[] } {
    let cmd: string = s.substring(s.indexOf("{")+1, s.indexOf("}"))
    let settings = cmd.split("&")
    let firstTypes: { [id: string]: boolean } = {"type": true, "album": true}
    if (settings[0] == "" || settings == null) return d
    settings.map((x) => {
        let data = x.split(":")
        let key = data[0].trim().toLowerCase()
        let value = data[1].trim()
        console.log("Key: " + key + ", Val: " + value)

        // I want the search cmds to override the filter UI options
        switch (key) {
            case "sorting":
                d["sorting"] = value
                break;
            case "sortby":
                d["sortBy"] = value
                break;
            case "type":
                if (firstTypes["type"]) {
                    d["mediaTypes"] = [value]
                    firstTypes["type"] = false;
                } else {
                    if (Array.isArray(d["mediaTypes"])){
                        d["mediaTypes"].push(value)
                    }
                }
                break;
            case "albums":
                if (firstTypes["album"]) {
                    d["albums"] = [value]
                    firstTypes["album"] = false;
                } else {
                    if (Array.isArray(d["albums"])){
                        d["albums"].push(value)
                    }
                }
                break;
            default:
                break;
        }
    })
    return d;
}

export const getMedias = async (offset: number, limit: number, filter?: FilterPrimative): Promise<MediaAlbums[]> => {
    try {
        let d: { [id: string]: string | string[] } = {}
        let params = `offset=${offset}&limit=${limit}`
        if (filter) {
            // Set the filter up with the UI settings
            if (filter.sorting) {
                d["sorting"] =  filter.sorting;
            }
            if (filter.sortBy) {
                d["sortBy"] = filter.sortBy;
            }
            if (filter.size) {
                d["size"] = filter.size;
            }
            if (filter.media.photos) {
                pushDict(d, [], "mediaTypes", "photos");
            }
            if (filter.media.videos) {
                pushDict(d, [], "mediaTypes", "videos");
            }
            if (filter.albums){
                for (let x in filter.albums){
                    pushDict(d, [], "albums", filter.albums[x]);
                }
            }

            // parseSearch is going to overwrite some of the settings.
            // search filters take percedence over UI
            if (filter.search != "") {
                d = parseSearch(filter.search, d);
            }

            // If it exists add it to the api string
            if (d["sorting"]) {
                params = params.concat(`&sorting=${d["sorting"]}`)
            }
            if (d["sortBy"]) {
                params = params.concat(`&sortBy=${d["sortBy"]}`)
            }
            if (d["size"]){
                params = params.concat(`&size=${d["size"]}`)
            }
            if (d["mediaTypes"] && Array.isArray(d["mediaTypes"])) {
                d["mediaTypes"].map((x) => {
                    params = params.concat(`&mediaTypes=${x}`)
                })
            }
            if (d["albums"] && Array.isArray(d["albums"])) {
                d["albums"].map((x) => {
                    params = params.concat(`&albums=${x}`)
                })
            }
            if (filter.search != ""){
                // Cut off the filter inside of search
                let xs = filter.search.substring(filter.search.indexOf("}")+1)
                xs = xs.trim();
                // Split search by '+' seperator so you can search multiple things
                let xsa: string[] = xs.split(' + ').map((y) => y.trim())
                if (xsa.length > 0){
                    for (let i = 0; i < xsa.length; i++) {
                        const e = xsa[i];
                        if (e != ""){
                            params = params.concat(`&search=${encodeURI(e)}`)
                        }
                    }
                }
            }
        }
        // console.log("Filter Dictionary:")
        // console.log(d)
        // console.log("Params: " + params)
        // console.log("Filter:")
        // console.log(filter)
        const response = await fetch(`http://localhost:3000/api/getMediaScroller?${params}`)
        const data = (await response.json())
        console.log(data)
        return data.medias
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}

export const getMedia = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:3000/api/getMedia?mediaID=${id}`)
        const data = (await response.json())
        return data
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
