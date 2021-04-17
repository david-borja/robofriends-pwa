import { shallow } from "enzyme";
import React from "react";
import Card from "./Card";

it("expect to render Card component", () => {
  const mockId = 1,
    mockName = "Pepito",
    mockEmail = "pepito@test.com";
  expect(
    shallow(<Card id={mockId} name={mockName} email={mockEmail} />)
  ).toMatchSnapshot();
});
