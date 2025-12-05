# Notes

## General

### AI Usage

Eric Wastl specifically states:

> **Should I use AI to solve Advent of Code puzzles?** No. If you send a friend to the gym on your behalf, would you expect to get stronger? Advent of Code puzzles are designed to be interesting for humans to solve - no consideration is made for whether AI can or cannot solve a puzzle. If you want practice prompting an AI, there are almost certainly better exercises elsewhere designed with that in mind.

Despite that, I am likely going to use (and in fact already have used) AI in limited capacities.

Things I will definitely **not** be doing:

- throwing the problem description into an LLM and see what pops out
- coding with inline LLM completion/suggestions enabled

Things I'll consider doing:

- asking Copilot about a platform specific API for reading a file instead of / in addition to looking at the docs myself
- after defining a method's API and hand-writing a few test cases, asking for a few more test cases
- use AI to help sort through TypeScript type errors or help me realize my vision for a more expressive type declaration

Things I'll definitely do (after using AI):

- read all the code; understand all the code
- rewrite/refine any code that doesn't feel like something I'd write

## `01`

<details>
<summary>Day 1 notes (possible spoilers)</summary>

### `import.meta.main`

```ts
if (import.meta.main) {
	// ...
}
```

This somewhat unusual looking pattern allows for conditionally running code in this module (file) depending on whether it is imported vs. run directly (e.g. `bun ./01`).

Ordinarily that seems like a kind of gross idea, but in the context of these problems, it enables me to export functions from this module that can be imported by tests, without the test's `import` actually evaluating the problem.

In a real-world project, it would likely make more sense to move the testable functions to a separate module and have both the tests and `index` import them, but in this toy problem context it feels nice to keep the functions co-located with the main logic.

### Named capture groups

```ts
const matched = line.match(/^(?<direction>[LR])(?<turns>\d+)$/)!;
return {
	direction: matched.groups!.direction as "L" | "R",
	turns: Number(matched.groups!.turns!),
};
```

I really like parsing with named capture groups. I keep thinking that it might be nice to formalize this oft-recurring pattern with a utility ~~but have yet to do so~~. [Edit: I did; it's `createParser` in `utility`, and it's pretty great in the circumstances I've used so far.]

### `.reduce((acc, curr) => (...), initial)`

So many of these Advent of Code problems can be expressed with `.reduce`. It's a bit of a meme at this point how likely I am to reach for it—just to tickle my brain—even when other, more explcitily iterative solutions look nice too.

It does seem like TypeScript's inference is working better than I've remembered.

### Math over loops

`rotateBy` and `countPassedZeros` use math + logic to produce the new results. It feels "right" to do that, but there's some pretty dense logic that has to be puzzled over to mentally debug all the paths. I'm sure there are dozens of different ways to express these computations, and it seems likely that several are better than what I have.

</details>

## `03`

<details>
<summary>Day 3 notes (possible spoilers)</summary>

### `part2` is masochistic

Yes; I know.

Nested `reduce`. Those inline destructures. What's wrong with a `for` loop, anyway?? (Nothing!)

I have no good explanation, other than I wanted to write it...

### ... also, that number processing

Building the number from the array of digits would've been very easy—and probably more readable!—just using strings and built-in parsing. The `Math.pow` flex is cool, but totally unecessary optimization for this.

### No BigInt yet

I was on the lookout for potentially needing `BigInt`, but every thing stayed comfortably under `Number.MAX_SAFE_INTEGER`.

</details>

## `04`

<details>
<summary>Day 4 notes (possible spoilers)</summary>

Oh boy, all the memes with this one! I love these grid based traversal ones, and I also like avoiding multidimensional arrays.

### 2D data in a 1D array

There's plenty already written about how to store/address 2D data in a 1D array. The math is very straightforward, and you can avoid multidimensional JS arrays.

### `enumerateGrid`

Generates a [Cartesian product](https://en.wikipedia.org/wiki/Cartesian_product) of the two sequences. For this helper, we put the `ys` generator first, emphasizing that the sequence is generated in [row-major order](https://en.wikipedia.org/wiki/Row-_and_column-major_order).

One little gotcha I ran into: generator functions can only be enumerated once, so the inner `xs` generator needs to be a fresh copy each time through. To ensure this, the API requires a generator factory rather than a generator instance.

### Recursion, oh my!

Full disclosure: I initially solved part 2 using a iterative approach (`while (true) {...}` + a well placed `break`). But I wasn't happy with the structure, and especially the top-level variables I had to interact with from within the loop. On a whim, I asked Claude what a tail recursive rewrite might look like, and kind of liked it. I heavily modified it and added an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), and of course I decided to keep this version!

### `.toSpliced(index, deleteCount, itemsToAdd...)`

`toSpliced` is a handy option for immutably modifying an array. Before that, I used to

```ts
[...arr.slice(0, index), item, ...arr.slice(index + 1)];
```

</details>
