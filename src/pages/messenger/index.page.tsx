import {CustomerAuthLayout} from "@/layouts";
import dynamic from 'next/dynamic'
const MessangerWidget = dynamic(() => import('@/widgets/messenger/messenger-widget'), {
    ssr: false,
    loading: () => null
});
export default function MessangerPage () {
    return(
        <CustomerAuthLayout>
                <MessangerWidget/>
        </CustomerAuthLayout>
    )
}