import moment from "moment-timezone";


const useFormatedDate = () => {


    const SetFormateDate = (date : Date) =>{
       const utcDate  =  moment.utc(date).tz("UTC");
       return   utcDate.local().format();
    }
  return {
    SetFormateDate
  };
};

export { useFormatedDate };
