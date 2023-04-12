import algoliasearch from 'algoliasearch';

const ALGOLIA_APP_ID = '9S6V07SZ8Z';
const ALGOLIA_SEARCH_ONLY_API_KEY  = 'da15f678944d0e74475ae760e053804a';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_API_KEY, {
  protocol: 'https:'
});
const index = client.initIndex('RSS');

export default index;
