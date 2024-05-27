import {useGomakeAxios} from "@/hooks";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useGoMakeTour} from "@/hooks/use-go-make-tour";
import {useRecoilState} from "recoil";
import {showTourModalState} from "@/store/tour-state";

const useHtmlTour = () => {
    const [htmlTour, setHtmlTour] = useState<string>('');
    const {callApi} = useGomakeAxios();
    const {pathname} = useRouter();
    const [showTourModal, setShowTourModal] = useRecoilState(showTourModalState);
    const {onClickHelpButton, setIsOpen} = useGoMakeTour([], []);

    const openModal = showTourModal && !!htmlTour;

    const onCloseModal = () => {
        setShowTourModal(false);
        onClickHelpButton();
    }

    const downloadHtmlFile = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const html = await response.text();
            setHtmlTour(html);
        } catch (error) {
        }
    };

    useEffect(() => {
        setShowTourModal(false);
        setIsOpen(false);
        callApi('GET', '/v1/get-tutorial-by-page?pagePath=' + pathname.substring(1), {}, true).then((res) => {
            const url = res?.data?.data?.data;
            if (!!url) {
                downloadHtmlFile(url).then()
            }
        })
    }, [pathname]);

    useEffect(() => {
        if (showTourModal && !htmlTour) {
            onClickHelpButton();
        }
    }, [showTourModal])
  return {
        htmlTour,
      openModal,
      onCloseModal
  }
}

export {useHtmlTour}