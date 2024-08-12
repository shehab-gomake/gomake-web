import {CustomerAuthLayout} from "@/layouts";
import dynamic from 'next/dynamic'

const MessangerWidget = dynamic(() => import('@/widgets/messenger/messenger-widget'), {
    ssr: false,
    loading: () => null
});
export default function MessangerClientPage() {
    return (
        <CustomerAuthLayout allowAnonymous={true} disableHeaderSideMenu={true}>
            <div style={{height: '100vh', maxHeight: '100vh'}}>
                <MessangerWidget/>
            </div>
        </CustomerAuthLayout>
    )
}