import {useEffect} from "react";
import {useRouter} from "next/router";
import {list} from "@/widgets/settings/side-list";

export default function S() {
    const {push} = useRouter()
    useEffect(() => {
        push('/settings/' + list[0].path).then();
    }, [])
    return <div/>
}