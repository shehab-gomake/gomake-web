import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

function RouteChangeConfirmation() {
    const router = useRouter();
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
    const handleRouteChange = () => {

        const userConfirmed = window.confirm('Do you want to continue to the new page?');

        if (userConfirmed) {
            setIsConfirmed(true);

        } else {
            router.events.emit('routeChangeError');
            router.events.off('beforeHistoryChange', handleRouteChange);
            router.push({
                pathname: router.pathname,
                query: router.query
            })
            setIsConfirmed(false)
        }
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => {
            if (!isConfirmed) {
                event.preventDefault();
                event.returnValue = 'You have unsaved changes. Are you sure you want to leave this page?';
            }
        };

        router.events.on('beforeHistoryChange', handleRouteChange);
        window.addEventListener('beforeunload', beforeUnloadHandler);

        return () => {
            router.events.off('beforeHistoryChange', handleRouteChange);
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, [isConfirmed]);


    return null;
}

export {RouteChangeConfirmation}