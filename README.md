# Shivangi & Shaan

A static family preview of the wedding website. The page, styles, scripts, and images are all in this repository.

## Edit the site

- Edit the timeline and guest information in `index.html`.
- Update the design in `styles.css`.
- Edit the timeline scroll and Jaipur map behavior in `site.js`.
- Replace artwork or photography in `assets/`. Keep file paths relative so they work on a GitHub Pages project URL.

Use a pull request to review changes before merging to `main`.

## Guest forms

The website can open Tally or Google Forms for hair and makeup requests and song suggestions. In the `cc-guest-form-links` JSON block in `index.html`, add the two published responder links. An empty entry leaves that form marked “Requests open soon.”

For Tally, publish each form and use its `https://tally.so/r/…` responder link. Responses stay in the Tally dashboard. A private spreadsheet connection is optional. Keep response dashboard links, credentials, and exports out of this repository.

For Google Forms, the setup script creates a separate response sheet for each form:

1. In [a new standalone Apps Script project](https://script.google.com/home/projects/create), paste [the setup script](tools/create-guest-forms.gs). Run `createWeddingGuestForms` and authorize access to Forms and Sheets. The execution log contains the two form edit links and their separate response sheets. Running the script again in the same project reuses the existing forms.
2. Open both forms in Google Forms. Publish each and set responder access to **Anyone with the link** if guests should be able to respond without invitations. Test each using a signed-out browser window and confirm a test response appears in the right sheet. Keep the response sheets private.
3. Copy each **responder link** into its entry in the `cc-guest-form-links` JSON block in `index.html`. The corresponding form link appears as soon as its responder URL is set. Never put form edit links or response sheet URLs in this public repository.

## GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, then **main** and **/ (root)**. GitHub Pages publishes the merged `main` branch. The `.nojekyll` file tells Pages to serve the static files directly.

The site has a `noindex` directive. Anyone can open the published page and read the public repository.
