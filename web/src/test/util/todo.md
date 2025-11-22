# todo

npx vitest --run

## すべからく

すべからく　べし　べき

## format

submodules/no-dropping-the-raのsrcとtestを参照して、
その内容を適切に
src/textlint/***.ts
test/json/***.json
にそれぞれ実装して欲しい。

今回、ファイル名はどちらもno_dropping_raとする。

backendの方は、大まかに次のような形式にそって実装して欲しい。

```typescript
import { Token } from "./parser";
import { TextlintError } from "./types";

export function functionName(allTokens: Token[][]): TextlintError[] {
    const results: TextlintError[] = [];
    for (const tokens of allTokens) {
        for (let i = 1; i < tokens.length; i++) {
            const prev = tokens[i - 1];
            const curr = tokens[i];

            if (...) {
                results.push({
                    message: "...",
                    range: curr.range,
                });
            }
        }
    }
    return results;
}
```

testの方は、次のような形式にそって実装して欲しい。

```json
{
    "_comments":[
        "url if any",
    ],
    "valid": [
        ...
    ],
    "invalid": [
        ...
    ]
}
```

なお、これらはあくまでひな形なので、必要であれば、適切に変更を加えても良い。
