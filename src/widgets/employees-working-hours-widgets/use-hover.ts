import {useState} from "react";

const useHover = () => {
  const [hover, setHover] = useState<boolean>(false);
    return {
      hover, setHover
  }
}

export {useHover}