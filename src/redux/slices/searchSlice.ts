import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  results: any[];
  page: number;
  hitsPerPage: number;
  nbPages: number;
  nbHits: number;
}

const initialState: SearchState = {
  query: '',
  results: [],
  page: 0,
  hitsPerPage: 20,
  nbHits: 0,
  nbPages: 0,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setResults: (state, action: PayloadAction<any>) => {
      state.results = action.payload.hits;
      state.nbPages = action.payload.nbPages;
      state.nbHits = action.payload.nbHits;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { setQuery, setResults, setPage } = searchSlice.actions;
export default searchSlice.reducer;
