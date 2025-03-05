export const DateFormatterDDMMYYYY = (date: string) => {
  if (date) {
    let myDate = date?.split("T")[0];
    let hours = date?.split("T")[1]?.split(":")[0];
    let minutes = date?.split("T")[1]?.split(":")[1];
    let day = myDate?.split("-")[2];
    let month = myDate?.split("-")[1];
    let year = myDate?.split("-")[0];
    return `${day}/${month}/${year} : ${hours}:${minutes}`;
  }
};

export const SeparateDateFormatterDDMMYYYY = (date: string) => {
  if (date) {
    const [myDate, time] = date.split("T");
    const [hours, minutes] = time.split(":");
    const [year, month, day] = myDate.split("-");

    const formattedDate = `${day}/${month}`;
    const formattedTime = `${hours}:${minutes}`;

    return { formattedDate, formattedTime };
  }
  return { formattedDate: "", formattedTime: "" }; // return empty strings if date is undefined
};

export const DateFormatter = (dateTime: string) => {
  if (dateTime) {
    let date = dateTime?.split("T")[0];
    let day = date?.split("-")[2];
    let month = date?.split("-")[1];
    let year = date?.split("-")[0];
    return `${day}/${month}/${year}`;
  }
};

export const DateFormatterShort = (date: string) => {
  if (date) {
    let myDate = date?.split("T")[0];
    let hours = date?.split("T")[1]?.split(":")[0];
    let minutes = date?.split("T")[1]?.split(":")[1];
    let day = myDate?.split("-")[2];
    let month = myDate?.split("-")[1];
    let year = myDate?.split("-")[0];

    // Format to DD:MM and HH:MM
    return `${hours}:${minutes} ${day}/${month}`;
  }
};

export const DateHourFormatterShort = (date: string) => {
  if (date) {
    let myDate = date?.split("T")[0];
    let hours = date?.split("T")[1]?.split(":")[0];
    let minutes = date?.split("T")[1]?.split(":")[1];
    let day = myDate?.split("-")[2];
    let month = myDate?.split("-")[1];
    let year = myDate?.split("-")[0];

    // Format to DD:MM and HH:MM
    return `${day}/${month} ${hours}:${minutes}`;
  }
};
