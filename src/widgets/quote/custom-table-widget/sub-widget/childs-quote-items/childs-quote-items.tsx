
const ChildsQuoteItems = ({childsQuoteItem}:any) => {
  return (
    <>
   {childsQuoteItem?.map((item, index) =>{
              return(
                <div>
                {item?.quantity}
                {item?.price}
                {item?.discount}
                {item?.finalPrice}
              </div>
              )
    })} 
    </>
  )
};
export { ChildsQuoteItems };
