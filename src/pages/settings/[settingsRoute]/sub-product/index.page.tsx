import {useRouter} from "next/router";
import {useEffect} from "react";

export default function GoBack() {
    const {push} = useRouter();
    useEffect(() => {
        push('../').then();
    }, [])
    return<div/>
}