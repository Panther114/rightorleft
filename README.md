# Right or Left

A 24-question political quiz covering current issues in the United States. Results place the respondent on two axes, economic (state to market) and authority (libertarian to authoritarian), with a separate cultural reading (progressive to traditional).

Live site: https://panther114.github.io/rightorleft/

## Structure

| File | Purpose |
|---|---|
| `index.html` | Page markup |
| `styles.css` | Theme, layout and animation |
| `data.js` | Questions, weights, issue groups, reference profiles, result types |
| `engine.js` | Scoring, spread, classification and share-code encoding |
| `app.js` | Quiz flow and result visualizations |

## Scoring

Each answer maps to +2, +1, −1 or −2; "Not sure" is excluded. Every question carries a weight between −1 and +1 on each dimension. An axis score is the weighted sum of answers divided by the maximum possible sum, scaled to −10…+10. Question order is randomized per session. Results are encoded in the URL fragment, so no data leaves the browser.
