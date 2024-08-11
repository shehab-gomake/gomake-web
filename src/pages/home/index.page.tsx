import { CustomerAuthLayout } from "@/layouts";
import { HomePageComponentForAdmin } from "@/pages-components/admin/home/home";


export default function Home() {
    return (
        <CustomerAuthLayout className={`custom-scrollbar`}>
            <HomePageComponentForAdmin isAdmin={false} />
        </CustomerAuthLayout>
    );
}
