import { CustomerAuthLayout } from "@/layouts";
import { HomePageComponentForAdmin } from "@/pages-components/admin/home/home";
import io from 'socket.io-client';
import {useEffect} from "react";

export default function Home() {
    
    
    return (
        <CustomerAuthLayout className={`custom-scrollbar`}>
            <HomePageComponentForAdmin isAdmin={false} />
        </CustomerAuthLayout>
    );
}
