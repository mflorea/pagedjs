const TIMEOUT = 10000; // Some book might take longer than this to renderer

describe("nth-of-type-selector", () => {
	let page;
	beforeAll(async () => {
		page = await loadPage("nth-of-type-selector/nth-of-type-selector.html", {
			ignoreMissingResources: true,
			routes: {
				"**/missing.css": {
					status: 404,
					contentType: "text/html",
					body: `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
  <head>
    <title>Missing</title>
  </head>
  <body>
    <p>:first-of-type not found {!}</p>
  </body>
</html>
`
				}
			}
		});
		return page.rendered;
	}, TIMEOUT);

	afterAll(async () => {
		if (!DEBUG) {
			await page.close();
		}
	});

	it("should render text", async () => {
		let text = await page.evaluate(() => document.body.textContent);
		expect(text).toContain("Chapter 1. Loomings.");
	});

	it("should render 14 pages", async () => {
		let pages = await page.$$eval(".pagedjs_page", (r) => r.length);
		expect(pages).toBe(14);
	});

	if (!DEBUG) {
		it("should create a pdf", async () => {
			let pdf = await page.pdf(PDF_SETTINGS);

			expect(pdf).toMatchPDFSnapshot(1);
			expect(pdf).toMatchPDFSnapshot(2);
		});
	}
}
);
