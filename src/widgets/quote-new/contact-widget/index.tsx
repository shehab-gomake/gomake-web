import { useState } from "react";
import { InputUpdatedValues } from "../input-updated-values";
import { useStyle } from "./style";
import { useContactNewWidget } from "./use-contact-widget";
import { AddPlusIcon, PlusNewIcon } from "@/icons";
import { ContactMapping } from "./contact-mapping";
import { AddContactNewWidget } from "./add-contact-widget";
import { Fade } from "@mui/material";

const ContactNewWidget = ({ values, getQuote }) => {
  const { clasess } = useStyle();
  const {
    quoteStateValue,
    quoteItemValue,
    clientContactsValue,
    items,
    setItems,
    changeItems,
    updateClientContact,
    t,
  } = useContactNewWidget();
  console.log("items", items);

  const [displayedItems, setDisplayedItems] = useState(2);

  const handleShowMore = () => {
    setDisplayedItems(items.length);
  };

  const handleShowLess = () => {
    setDisplayedItems(2);
  };

  return (
    <div style={clasess.mainContainer}>
      <AddContactNewWidget />
      <div>
        {items?.length > 0 ? (
          <>
            {/* {items?.map((item: any, index: number) => {
              return <ContactMapping item={item} key={index} index={index} />;
            })} */}
            <div>
              {items?.slice(0, displayedItems).map((item, index) => (
                <ContactMapping item={item} key={index} index={index} />
              ))}
            </div>
          </>
        ) : (
          <div style={clasess.addNewContactNameStyle}>
            <PlusNewIcon />
            <div style={clasess.addNewContactNameTextStyle}>Add Contact</div>
          </div>
        )}
      </div>
      {items?.length > 2 && displayedItems === 2 && (
        <div style={clasess.showLessContainer} onClick={handleShowMore}>
          Show More
        </div>
      )}
      {items?.length > 2 && displayedItems > 2 && (
        <div style={clasess.showLessContainer} onClick={handleShowLess}>
          Show Less
        </div>
      )}
      <AddContactNewWidget />
    </div>
  );
};

export { ContactNewWidget };
