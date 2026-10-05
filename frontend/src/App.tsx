import { useState, useEffect, type ChangeEvent } from "react";

const USERS = ["Alice", "Alan", "Albert", "Bob", "Bianca", "Carlos", "Carla", "Diana"];
const DEBOUNCE_MS = 300;

// outside the component so it isn't recreated every render
const searchUsers = (query: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    // random delay so out-of-order responses actually happen
    const delay = 200 + Math.random() * 800;
    setTimeout(() => {
      // occasional failure to exercise the error state
      if (Math.random() < 0.1) return reject(new Error("Network error"));
      resolve(USERS.filter((u) => u.toLowerCase().startsWith(query.toLowerCase())));
    }, delay);
  });

const App = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // skip the API call for an empty input
    if (!search) {
      setResults([]);
      return;
    }

    let ignore = false;

    // only fire when the user stops typing for DEBOUNCE_MS
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchUsers(search);
        // a newer search took over, so drop this stale response
        if (!ignore) setResults(data);
      } catch {
        if (!ignore) setError("Something went wrong");
      } finally {
        if (!ignore) setLoading(false);
      }
    }, DEBOUNCE_MS);

    // runs before the next effect, so each keystroke cancels the last timer
    return () => {
      clearTimeout(timer);
      ignore = true;
    };
  }, [search]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSelect = (name: string) => {
    setSearch(name);
    setResults([]);
  };

  return (
    <div>
      <input value={search} onChange={handleInput} />

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {/* only show "No results" after a finished search */}
      {!loading && !error && search && results.length === 0 && <div>No results</div>}

      <div>
        {results.map((result) => (
          <div key={result} onClick={() => handleSelect(result)}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
