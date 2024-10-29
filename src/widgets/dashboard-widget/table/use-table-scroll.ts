import {useRef, useState} from "react";
import {useTranslation} from "react-i18next";

const useTableScroll = () => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [clientWidth, setClientWidth] = useState<number>();
    const SCROLL_STEP = 100;
    const {t} = useTranslation();
    const direction = t('direction');
    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current;
            if (direction === 'ltr') {
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
            } else {
                setCanScrollLeft(scrollLeft < 0);
                setCanScrollRight(scrollWidth + scrollLeft !== clientWidth + 1);
            }
            setClientWidth(scrollWidth - clientWidth);
        }
    };

    const scroll = (direction) => {
        const {scrollLeft} = scrollRef.current;
        scrollRef.current.scrollTo({
            left: scrollLeft + (direction === "right" ? SCROLL_STEP : -SCROLL_STEP),
            behavior: "smooth",
        });
        checkScrollPosition();
    };
    return {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        scroll,
        checkScrollPosition,
        clientWidth
    }
}
export {useTableScroll}