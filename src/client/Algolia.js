import algoliasearch from 'algoliasearch';

const ALGOLIA_APP_ID = '72TJQFTTSX';
const ALGOLIA_SEARCH_ONLY_API_KEY  = 'c0a3e18f3ec45a6ca0c03cd98fd432cf';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_API_KEY, {
  protocol: 'https:'
});
const index = client.initIndex('RSS');

export default index;
