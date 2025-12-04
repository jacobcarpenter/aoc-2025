# Implementation Notes

## `import.meta.main`

```ts
if (import.meta.main) {
	// ...
}
```

This somewhat unusual looking pattern allows for conditionally running code in this module (file) depending on whether it is imported vs. run directly (e.g. `bun ./01`).

Ordinarily that seems like a kind of gross idea, but in the context of these problems, it enables me to export functions from this module that can be imported by tests, without the test's `import` actually evaluating the problem.

In a real-world project, it would likely make more sense to move the testable functions to a separate module and have both the tests and `index` import them, but in this toy problem context it feels nice to keep the functions co-located with the main logic.

## Named capture groups

```ts
const matched = line.match(/^(?<direction>[LR])(?<turns>\d+)$/)!;
return {
	direction: matched.groups!.direction as "L" | "R",
	turns: Number(matched.groups!.turns!),
};
```

I really like parsing with named capture groups. I keep thinking that it might be nice to formalize this oft-recurring pattern with a utility ~~but have yet to do so~~. [Edit: I did; it's `createParser` in `utility`, and it's pretty great in the circumstances I've used so far.]

## `.reduce((acc, curr) => (...), initial)`

So many of these Advent of Code problems can be expressed with `.reduce`. It's a bit of a meme at this point how likely I am to reach for it—just to tickle my brain—even when other, more explcitily iterative solutions look nice too.

It does seem like TypeScript's inference is working better than I've remembered.

## Math over loops

`rotateBy` and `countPassedZeros` use math + logic to produce the new results. It feels "right" to do that, but there's some pretty dense logic that has to be puzzled over to mentally debug all the paths. I'm sure there are dozens of different ways to express these computations, and it seems likely that serveral are better than what I have.
