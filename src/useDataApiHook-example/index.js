import React, { Fragment, useState, useEffect, useReducer } from 'react';
import axios from 'axios';

const dataFetchReducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_INIT':
			return { ...state, isLoading: true, isError: false };
		case 'FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload
			};
		case 'FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				isError: true
			};
		default:
			throw new Error();
	}
};

const useDataApi = (initialData, initialUrl = 'http://hn.algolia.com/api/v1/search?query=redux') => {
	const [ url, setUrl ] = useState(initialUrl);

	const [ state, dispatch ] = useReducer(dataFetchReducer, {
		//  passing isLoading and isError property is redundant here
		data: initialData
	});

	useEffect(
		() => {
			let didCancel = false;

			const fetchData = async () => {
				dispatch({ type: 'FETCH_INIT' });

				try {
					const result = await axios(url);

					if (!didCancel) {
						dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
					}
				} catch (error) {
					if (!didCancel) {
						dispatch({ type: 'FETCH_FAILURE' });
					}
				}
			};

			fetchData();

			return () => {
				didCancel = true;
			};
		},
		[ url ]
	);

	return [ state, setUrl ];
};

function App() {
	const [ query, setQuery ] = useState('redux');
	// Now our Custom hookAPI resemble more like native hook
	const [ result, setUrl ] = useDataApi({ hits: [] });
	const { data, isLoading, isError } = result;

	return (
		<Fragment>
			<form
				onSubmit={(event) => {
					setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);

					event.preventDefault();
				}}
			>
				<input type="text" value={query} onChange={(event) => setQuery(event.target.value)} />
				<button type="submit">Search</button>
			</form>

			{isError && <div style={{ color: 'red' }}>Something went wrong ...</div>}

			{isLoading ? (
				<div>Loading ...</div>
			) : (
				<ul>
					{data.hits.map((item) => (
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
