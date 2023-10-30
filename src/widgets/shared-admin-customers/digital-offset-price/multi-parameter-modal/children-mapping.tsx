import { ChildrenValuesMapping } from "./children-values-mapping";

const ChildrenMapping = ({ paameters, item, index, clasess }) => {
  return (
    <div
      style={{
        minWidth: index == 0 ? "50%" : "25%",
        maxWidth: index == 0 ? "50%" : "25%",
        textAlign: "left",
      }}
    >
      {item?.values.map((value) => (
        <ChildrenValuesMapping
          paameters={paameters}
          item={item}
          value={value}
          clasess={clasess}
        />
      ))}
    </div>
  );
};
export { ChildrenMapping };
