import React from "react";
import { serializeAPIMessageToPrompts } from "utilities/apiSerializers";

test("serializes API response", () => {
  const testPrompt = {
    prompt: "Today, I went on an adventure to a new country",
    text_0:
      " that I've never been to. I went to a place called… I met a guy named Carlos. And I'm not",
    text_1:
      ". I was given a new car. I was given a new car and…irst car that I drove was a Ford Mustang. I drove",
    text_2:
      " and I got to meet a lot of people. I had the chan… was very happy to meet them. I was very happy to",
    text_3:
      ". And the adventure was the same as any adventure … different. It was something that I never thought"
  };

  const result = serializeAPIMessageToPrompts({ message: testPrompt });

  expect(result.length).toEqual(4);

  // added a space to make it print prettier
  expect(result).toEqual([
    testPrompt.text_0 + " ",
    testPrompt.text_1 + " ",
    testPrompt.text_2 + " ",
    testPrompt.text_3 + " "
  ]);
});
