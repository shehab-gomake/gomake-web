import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { ContactMapping } from "./contacts-mapping";

const ContactsWidget = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const quoteStateValue = useRecoilValue<any>(quoteItemState);
    const items = quoteStateValue?.documentContacts;
    const [displayedItems, setDisplayedItems] = useState<number>(1);

    const handleShowMore = () => {
        setDisplayedItems(items.length);
    };

    const handleShowLess = () => {
        setDisplayedItems(1);
    };

    return (
        <>
            <div style={classes.businessContainerStyle}>
                <div style={classes.mainContainer}>
                    {items?.length > 0 &&
                        <>
                            <div >
                                {items?.slice(0, displayedItems).map((item, index) => (
                                    <ContactMapping
                                        key={`${index}-${item.id}`}
                                        items={items}
                                        item={item}
                                    />
                                ))}
                                {items?.length > 1 && displayedItems === 1 && (
                                    <div style={classes.showLessContainer} onClick={handleShowMore}>
                                        {t("sales.quote.showMore")}
                                    </div>
                                )}
                                {items?.length > 1 && displayedItems > 1 && (
                                    <div style={classes.showLessContainer} onClick={handleShowLess}>
                                        {t("sales.quote.showLess")}
                                    </div>
                                )}
                            </div>
                        </>}
                </div>
            </div>
        </>
    );
};

export { ContactsWidget };