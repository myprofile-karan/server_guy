import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';
import { setQuery, setResults, setPage } from '../redux/slices/searchSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Box, Typography, CircularProgress, Pagination, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import HighlightedText from '../components/HighlightedText';

dayjs.extend(relativeTime);

// Options arrays
const sortByType = [
  { value: 'story', label: 'Stories' },
  { value: 'comment', label: 'Comments' },
  { value: 'ask_hn', label: 'Ask HN' },
  { value: 'show_hn', label: 'Show HN' },
  { value: 'launch_hn', label: 'Launch HN' },
  { value: 'job', label: 'Jobs' },
  { value: 'poll', label: 'Polls' },
];

const sortByPopularityOrDate = [
  { value: 'search', label: 'Popularity' },
  { value: 'search_by_date', label: 'Date' },
];

const sortByTime = [
  { value: 'all', label: 'All time' },
  { value: '24h', label: 'Last 24h' },
  { value: '7d', label: 'Past week' },
  { value: '30d', label: 'Past month' },
  { value: '365d', label: 'Past year' },
];

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [requestTime, setRequestTime] = useState<number>(0);

  // Dropdown states
  const [type, setType] = useState(sortByType[0].value);
  const [popular, setPopular] = useState(sortByPopularityOrDate[0].value);
  const [timeRange, setTimeRange] = useState(sortByTime[0].value);

  // Extract query, results, and pagination details from Redux
  const { query, results, page, hitsPerPage, nbPages, nbHits } = useSelector((state: RootState) => state.search);

  // Sync the URL query parameter with Redux and input state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlQuery = searchParams.get('query') || '';

    if (urlQuery !== query) {
      dispatch(setQuery(urlQuery));
    }
    fetchData(page, urlQuery, type, popular, timeRange);
  }, [location.search, page, type, popular, timeRange, dispatch]);

  // Helper function to get timestamp for time range
  const getTimeRangeTimestamp = (range: string) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    switch (range) {
      case '24h':
        return now - (24 * 60 * 60);
      case '7d':
        return now - (7 * 24 * 60 * 60);
      case '30d':
        return now - (30 * 24 * 60 * 60);
      case '365d':
        return now - (365 * 24 * 60 * 60);
      default:
        return 0;
    }
  };

  // Fetch data based on query, page number, and filter selections
  const fetchData = async (pageNumber: number, searchQuery: string, searchType: string, sortBy: string, timeFilter: string) => {
    try {
      setLoading(true);
      const startTime = performance.now();

      const baseUrl = `https://hn.algolia.com/api/v1/${sortBy}`;
      const url = new URL(baseUrl);

      const params: Record<string, string> = {
        query: searchQuery,
        page: pageNumber.toString(),
        hitsPerPage: hitsPerPage.toString(),
      };

      // Add type filter
      if (searchType && searchType !== 'story') {
        params.tags = searchType;
      }

      // Add time range filter
      if (timeFilter !== 'all') {
        const timestamp = getTimeRangeTimestamp(timeFilter);
        if (timestamp > 0) {
          params.numericFilters = `created_at_i>${timestamp}`;
        }
      }

      url.search = new URLSearchParams(params).toString();

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const endTime = performance.now();
      setRequestTime((endTime - startTime) / 1000);
      dispatch(setResults(data));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change in pagination
  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage - 1));
    fetchData(newPage - 1, query, type, popular, timeRange);
  };

  // Handle dropdown changes
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value as string;
    setType(newType);
    dispatch(setPage(0));
    fetchData(0, query, newType, popular, timeRange);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const newSort = event.target.value as string;
    setPopular(newSort);
    dispatch(setPage(0));
    fetchData(0, query, type, newSort, timeRange);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    const newTimeRange = event.target.value as string;
    setTimeRange(newTimeRange);
    dispatch(setPage(0));
    fetchData(0, query, type, popular, newTimeRange);
  };

  return (
    <div>
      <Header query={query} />

      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: "center", my: 2, ml: 2, gap: 2 }}>
          <span>Search</span>
          <Select
            value={type}
            onChange={handleTypeChange}
            displayEmpty
            sx={{
              minWidth: {
                xs: 100,
                sm: 130
              },
              background: "white",
              height: {
                xs: 25,
                md: 35
              },
              '.MuiOutlinedInput-input': {
                padding: '8px 14px'
              }
            }}
          >
            {sortByType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>

          <span>by</span>
          <Select
            value={popular}
            onChange={handleSortChange}
            displayEmpty
            sx={{
              minWidth: {
                xs: 100,
                sm: 130
              },
              background: "white",
              height: {
                xs: 25,
                md: 35
              },
              '.MuiOutlinedInput-input': {
                padding: '8px 14px'
              }
            }}
          >
            {sortByPopularityOrDate.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>

          <span>for</span>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            displayEmpty
            sx={{
              minWidth: {
                xs: 100,
                sm: 130
              },
              background: "white",
              height: {
                xs: 25,
                md: 35
              },
              '.MuiOutlinedInput-input': {
                padding: '8px 14px'
              }
            }}
          >
            {sortByTime.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Typography sx={{ fontSize: "20px", fontFamily: "cursive", fontWeight: "600", cursor: "pointer", '&:hover': { textDecoration: 'underline' } }}>
          {results && nbHits} results ({requestTime.toFixed(3)} seconds)
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress sx={{ color: '#FF742B' }} />
        </Box>
      ) : (
        <>
          <Box sx={{ p: 2 }}>
            {results && results.length > 0 ? (
              results.map((result) => (
                <Box key={result.objectID} sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                    <Typography sx={{
                      width: "100%",
                      fontSize: "22px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}>
                      <HighlightedText text={result.title} query={query} />
                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginLeft: "10px", fontSize: "18px", color: "#828282", textDecoration: "none", cursor: "pointer" }}
                          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          ({result.url})
                        </a>
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Typography component={"span"} sx={{ fontSize: "16px", fontWeight: "500", color: "#828282", cursor: "pointer", '&:hover': { textDecoration: 'underline' } }}>
                      {result.points || 0} points |
                    </Typography>
                    <Typography component={"span"} sx={{ fontSize: "16px", fontWeight: "500", color: "#828282", cursor: "pointer", '&:hover': { textDecoration: 'underline' } }}>
                      {result.author} |
                    </Typography>
                    <Typography component={"span"} sx={{ fontSize: "16px", fontWeight: "500", color: "#828282", cursor: "pointer", '&:hover': { textDecoration: 'underline' } }}>
                      {dayjs(result.created_at).fromNow()} |
                    </Typography>
                    <Typography component={"span"} sx={{ fontSize: "16px", fontWeight: "500", color: "#828282", cursor: "pointer", '&:hover': { textDecoration: 'underline' } }}>
                      {result.num_comments || 0} comments
                    </Typography>
                  </Box>
                  {result.story_text && (
                    <Box sx={{ px: 2, lineHeight: "1.4", fontSize: "18px", fontWeight: "400", fontFamily: "cursive" }}>
                      {result.story_text}
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', mt: 4 }}>
                No results found. Try adjusting your search criteria.
              </Typography>
            )}
          </Box>
          {nbPages > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Pagination
                count={nbPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    backgroundColor: '#fff',
                    color: "black",
                    borderRadius: "5px",
                  },
                  '& .Mui-selected': {
                    background: '#ffffff',
                    border: '1px solid #FF742B !important',
                    color: '#FF742B',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;
