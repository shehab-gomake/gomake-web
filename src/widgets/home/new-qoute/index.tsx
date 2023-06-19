import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { BarChart } from "./bar-chart";

const NewQoute = () => {
  const { clasess } = useStyle();
  return (
    <>
      <div style={clasess.title}>New Quote</div>
      <div style={clasess.cardsContainer}>
        <div
          style={{
            ...clasess.card,
            paddingLeft: 9,
            paddingTop: 40,
            paddingBottom: 40,
            paddingRight: 28,
            width: "60%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 30,
              }}
            >
              <div style={{ width: "70%" }}>
                <GoMakeAutoComplate
                  options={[{ label: "New", value: "New" }]}
                  placeholder={"Select Customer"}
                  style={clasess.autoComplateStyle}
                />
              </div>
              <div style={{ width: "30%" }}>
                <GoMakeAutoComplate
                  options={[{ label: "New", value: "New" }]}
                  placeholder={"Select Type"}
                  style={clasess.autoComplateStyle}
                />
              </div>
            </div>
            <div style={{ width: "67%" }}>
              <GoMakeAutoComplate
                options={[{ label: "New", value: "New" }]}
                placeholder={"Select Product"}
                style={clasess.autoComplateStyle}
              />
            </div>
            <div style={{ width: "50%", alignSelf: "center" }}>
              <GomakePrimaryButton>Create qoute</GomakePrimaryButton>
            </div>
          </div>
        </div>
        <div
          style={{
            ...clasess.card,
            paddingLeft: 20,
            paddingTop: 12,
            paddingBottom: 12,
            paddingRight: 20,
            width: "40%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: 185 }}>
              <GoMakeAutoComplate
                options={[{ label: "New", value: "New" }]}
                placeholder={"Type"}
                style={clasess.autoComplateStyle2}
                arrowColor={"#3D3C42"}
              />
            </div>
            <div style={{ width: 127 }}>
              <GoMakeAutoComplate
                options={[{ label: "New", value: "New" }]}
                placeholder={"Range"}
                style={clasess.autoComplateStyle2}
                arrowColor={"#3D3C42"}
              />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "88%" }}>
              <BarChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { NewQoute };
