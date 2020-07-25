# Development

## Setting up

Create a `.env` file that defines your own [Google Sheets API Key (Instructions to generate one)](https://developers.google.com/sheets/api/guides/authorizing#APIKey) in the repository with the following:

```
GOOGLE_API_KEY="Generated_Google_API_Key"
```


To build the data ingestion and publishing tool:

```
npm install
```

## Manually regenerate data

To run the data generation:

```
node generate.js
```

This will output the data into `docs/` 

To make the data ready for publishing (which really just changes the symlink latest.json):

```
node publish.js
```

## Publish Cycle

Every 15 minutes a Github Workflow runs `.github/workflows/update.yml` to fetch the latest
data from the spreadsheet, runs a set of post processing on it and checks in the generated
JSON file in to the `docs/` directory.

Github workflow will use Github secrets for the main repository for the api key, reading from GOOGLE_API_KEY.

If it detects some data inconsistencies, it will abort and not check in any data. The data
verification checks are in `src/verify.js`
