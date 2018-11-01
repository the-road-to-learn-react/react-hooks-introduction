import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const useDataApi = (url, defaultSearch, defaultState) => {
  const [data, setData] = useState(defaultState);
  const [search, setSearch] = useState(defaultSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(
    async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(`${url}${search}`);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    },
    [search],
  );

  const doSearch = (event, query) => {
    setSearch(query);
    event.preventDefault();
  };

  return { data, isLoading, isError, doSearch };
};

const INITIAL_SEARCH = 'redux';
const INITIAL_DATA = { hits: [] };

function App() {
  const [query, setQuery] = useState(INITIAL_SEARCH);

  const { data, isLoading, isError, doSearch } = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=',
    INITIAL_SEARCH,
    INITIAL_DATA,
  );

  return (
    <Fragment>
      <form onSubmit={event => doSearch(event, query)}>
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;
