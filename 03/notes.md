# Implementation Notes

## `part2` is masochistic

Yes; I know.

Nested `reduce`. Those inline destructures. What's wrong with a `for` loop, anyway?? (Nothing!)

I have no good explanation, other than I wanted to write it...

## ... also, that number processing

Building the number from the array of digits would've been very easy—and probably more readable!—just using strings and built-in parsing. The `Math.pow` flex is cool, but totally unecessary optimization for this.

## No BigInt yet

I was on the lookout for potentially needing `BigInt`, but every thing stayed comfortably under `Number.MAX_SAFE_INTEGER`.
