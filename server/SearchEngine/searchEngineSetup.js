import algoliasearch from "algoliasearch";

const client = algoliasearch("JZ5M0HIHE7","a76b4d9daa9bd7602d4780f603f277e1");
const index = client.initIndex("products");
export {client,index};