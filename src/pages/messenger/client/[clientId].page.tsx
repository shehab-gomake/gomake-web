import {CustomerAuthLayout} from "@/layouts";
import dynamic from 'next/dynamic'
import {EUserType} from "@/widgets/messenger/messenger-widget";

const MessangerWidget = dynamic(() => import('@/widgets/messenger/messenger-widget'), {
    ssr: false,
    loading: () => null
});
export default function MessangerClientPage() {
    return (
        <CustomerAuthLayout allowAnonymous={true} disableHeaderSideMenu={true}>
            <div style={{height: '100vh', maxHeight: '100vh'}}>
                <MessangerWidget userType={EUserType.CLIENT}/>
            </div>
        </CustomerAuthLayout>
    )
}