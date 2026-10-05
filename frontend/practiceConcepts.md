# Frontend Interview Exercises

React + TypeScript. Time-box each one, talk through decisions out loud, then practice the
follow-ups.

---

## 0. Typeahead search ✅

> Build a search input that suggests user names as you type.

**Requirements**

- Fetch suggestions from a mock `searchUsers(query)` with a random delay
- Debounce the input so the API isn't called on every keystroke
- Only show results for the latest query, never stale ones
- Show loading, empty ("No results"), and error states
- Clicking a suggestion fills the input

**Follow-ups:** How would you cache past queries? How do you add keyboard navigation (↑ ↓ Enter
Esc)? Which ARIA attributes does a combobox need?

---

## 1. Custom `useFetch` hook

> Write a hook `useFetch<T>(url)` that returns `{ data, error, loading, refetch }`.

**Requirements**

- Cache results by URL, so a second component using the same URL gets data instantly
- Dedupe in-flight requests, so two components mounting at the same time with the same URL make only
  **one** network request
- Abort the request if the component unmounts or the URL changes
- Fully typed with generics

**Test:** Render two components using the same URL and check the Network tab for a single request.

**Follow-ups:** How do you invalidate the cache? What is stale-while-revalidate? Why not just use
React Query?

---

## 2. Infinite scroll

> Render a list of items that loads more as you scroll to the bottom.

**Requirements**

- Write a mock `fetchItems(cursor)` that returns `{ items, nextCursor }`, 20 items at a time
- Use **IntersectionObserver** on an element at the bottom of the list to trigger the next load
- Show a loading indicator while fetching
- Never fire a second fetch while one is already loading
- Stop loading when `nextCursor` is `null`, and show "No more items"

**Follow-ups:** What happens at 100k items, and what is virtualization? How do you restore scroll
position after navigating back?

---

## 3. Optimistic like button

> Show a list of posts, each with a like button and a like count.

**Requirements**

- Clicking updates the count and icon **immediately**, before the API responds
- Mock `toggleLike(postId)` with a random delay that fails 30% of the time
- On failure, revert the count and show an error message
- Rapid repeated clicks shouldn't leave the count wrong

**Follow-ups:** How do you handle the rapid-click race? When should you **not** use optimistic
updates?

---

## 4. Modal with focus trap

> Build an accessible modal that opens from a button.

**Requirements**

- On open, focus moves into the modal
- Tab and Shift+Tab cycle only through elements inside the modal
- Escape closes it, and so does clicking the backdrop
- On close, focus returns to the button that opened it
- Use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`

**Follow-ups:** Why render it in a portal? How do you lock background scrolling? What about the
native `<dialog>` element?

---

## 5. Fix a re-render problem

> First build it broken: a search input above a list of 5,000 rows, where each row does some slow
> work (a fake loop). Typing will lag. Then fix it.

**Requirements**

- Use the React DevTools Profiler to find what's re-rendering
- Fix it with `memo` on the row component, `useMemo` for the filtered list, and `useCallback` for
  handlers passed to rows
- Be able to explain why each fix helps

**Follow-ups:** When does `memo` hurt instead of help? Why do inline functions break `memo`? What
does `useDeferredValue` do?
