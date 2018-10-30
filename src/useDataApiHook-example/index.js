import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useDataApi = url => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(async () => {
    setLoading(true);

    const result = await axios(url);

    setLoading(false);
    setData(result.data);
  }, []);

  return { data, isLoading };
};

function App() {
  const { data, isLoading } = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=redux',
  );

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
