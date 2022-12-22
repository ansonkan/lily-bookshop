This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## todo

- [ ] UI
  - [x] Home page
    - [x] Add a soft background to the landing scene to try to make it less bleak
    - [x] Complete the search form in the landing scene
    - [x] Complete the search form in the header. As search button that toggles the header between a search input and the header
    - [x] Investigate the horizontal scrollbar in Windows. Might need to use [SimpleBar](https://github.com/Grsmto/simplebar/tree/master/packages/simplebar-react#1-documentation) or other workaround if it looks bad
  - [ ] Search result page
    - [ ] breadcrumbs
    - [ ] result section
    - [ ] pagination
  - [ ] Book details page
    - [ ] breadcrumbs
    - [ ] details section
    - [ ] related books section ([$search](https://www.mongodb.com/docs/atlas/atlas-search/tutorial/run-query/) + [$sample](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sample/)?)
  - [ ] i18n ([Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing) + [next-i18next](https://github.com/i18next/next-i18next))
  - [ ] Blog post list page
  - [ ] Blog post page
- [ ] CMS
  - [ ] create a new Directus project
  - [ ] setup a Directus webbook to sync book entries to MongoDB Atlas
  - [ ] create a script the read Array<{`ISBN` + images}> -> look up details through [Google Books search API](https://developers.google.com/books/docs/v1/using#PerformingSearch) -> import the details and images to Directus (-> import the same set of data to MongoDB Atlas if the webhook doesn't work for imports)
- [ ] Integration
  - [ ] Home page
    - [ ] search
    - [ ] Highlights
    - [ ] Latest Additions
  - [ ] Book details page
    - [ ] details section
    - [ ] related books section
  - [ ] Search result page
    - [ ] result section
- [ ] Platform
  - [ ] Investigate `SSR` vs `SSG` + `ISR` because Netlify doesn't support caching on `SSR` pages (https://docs.netlify.com/integrations/frameworks/next-js/overview/#limitations) and AWS Amplify seems to support that and most of the Next.js 12 & 13 features (https://aws.amazon.com/about-aws/whats-new/2022/11/aws-amplify-hosting-support-next-js-12-13/)
  - [ ] buy a domain
  - [ ] deploy
- [ ] Import the real books from the Lily Bookshop

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Netlify

[![Netlify Status](https://api.netlify.com/api/v1/badges/234ccdd6-1439-49d5-aaca-47cd9a29ab09/deploy-status)](https://app.netlify.com/sites/lilybookshop/deploys)

### Why?

`Netlify` is almost like `Vercel` and allow commercial usage in free tier accounts but comes with come limitations, see https://docs.netlify.com/integrations/frameworks/next-js/overview/#limitations.

- `Vercel` doesn't allow commercial usage in free tier accounts, see https://vercel.com/docs/concepts/limits/fair-use-policy#commercial-usage
- `Cloudflare page` requires the experimental edge runtime which I couldn't get it to work locally, see https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#configure-the-project-to-use-the-edge-runtime
- `AWS` + `SST` is simply way too much work and overcomplicated for such small project
