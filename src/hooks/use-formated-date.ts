import moment from "moment-timezone";


const useFormatedDate = () => {


    const SetFormateDate = (date : Date) =>{
       const utcDate  =  moment.utc(date).tz("UTC");
       console.log(" utcDate is "  , utcDate.local().format())
       //return   utcDate.local();
    }
  return {
    SetFormateDate
  };
};

export { useFormatedDate };
