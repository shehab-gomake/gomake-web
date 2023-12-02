import renderer from "react-test-renderer";
import { GoMakeAutoComplate } from "../auto-complete";

it("renders correctly", () => {
  const tree = renderer.create(<GoMakeAutoComplate options={[]} />).toJSON();
  expect(tree).toMatchSnapshot();
});
