import React from "react";
import { getRandomItemFromArray } from "utilities/utilities";

test("it randomly gives me something random", () => {
  const randArray = [1, 2];

  const randItem = getRandomItemFromArray(randArray);

  expect(randArray.includes(randItem));
});
