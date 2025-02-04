const FONT_FAMILY = {
  Outfit: (fontWeight: number, fontSize: number) => {
    return {
      fontFamily: "Outfit",
      fontWeight,
      fontSize,
    };
  },
  Lexend: (fontWeight: number, fontSize: number) => {
    return {
      fontFamily: "Lexend",
      fontWeight,
      fontSize,
    };
  },
  Inter: (fontWeight: number, fontSize: number) => {
    return {
      fontFamily: "Inter",
      fontWeight,
      fontSize,
    };
  },
  Heebo: (fontWeight: number, fontSize: number) => {
    return {
      fontFamily: "Heebo",
      fontWeight,
      fontSize
    }
  }
};

export { FONT_FAMILY };
