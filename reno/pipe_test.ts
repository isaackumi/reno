import { test } from "../deps.ts";
import pipe from "./pipe.ts";
import { textResponse } from "./helpers.ts";
import { createAugmentedRequest } from "../test_utils.ts";
import { assertResponsesMatch } from "./testing.ts";

test({
  name: "pipe takes a set in input morphs and returns a higher-order route handler",
  async fn() {
    const handler = () => ({
      ...textResponse("Foo"),
      status: 200
    });

    const withCaching = pipe(
      (req, res) => {
        res.headers.append("Cache-Control", "max-age=86400");
        return res;
      },
      (req, res) => ({
        ...res,
        cookies: new Map<string, string>([
          ["requested_proto", req.proto]
        ])
      }),
    );

    const req = await createAugmentedRequest({
      path: "/foo"
    });

    const cachingHandler = withCaching(handler);
    const res = await cachingHandler(req);

    assertResponsesMatch(res, {
      ...textResponse("Foo"),
      status: 200,
      headers: new Headers({
        "Content-Type": "text/plain",
        "Cache-Control": "max-age=86400"
      }),
      cookies: new Map<string, string>([
        ["requested_proto", "HTTP/1.1"]
      ])
    });
  }
})
