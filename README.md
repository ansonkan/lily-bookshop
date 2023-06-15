This was a failed attempt to help create a website for a local book store. My original intention was to build a website to provide easier book searching to customers, but me and the book store owner figured a POS system is needed way more than a website like this. A bad move for me to dive right into this website without getting clear requiremtns first. Lesson learned.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## todo

- [x] components are too small for Lily I think, especially she uses her mobile phone only, let's just use the default `size` of chakra components, removing all of the smaller `size`
- split the `cms` page into small pages, like:

  - [ ] `/cms`, where you login, after logged in is where you see what you can manage
    - [ ] `/cms/books` - book table + same thing + a button to go to /`cms/books/categories`
      - [x] `/cms/books/add` - just 1 at a time to keep it simple
      - [ ] `/cms/books/search-from-google-book` - just 1 at a time
      - `/cms/books/featured-section` -
      - [x] `/cms/books/[id]`
      - [x] `/cms/books/[id]/edit`
      - [ ] `/cms/books/categories` - table + all the action like the current books page because this should only have 2 fields to input for each category - each categories record must have: - chinese label (for display) - english label (for display) - code (auto derived from english label)
    - [x] `/cms/my-account` - same thing, all the change password, username, ... just keep it for later
    - [ ] `/cms/articles`
      - ... just keep it for later

- [x] `Pagination` just use number
- [x] wrap the form fields in grid
- [x] `status` -> only `draft` and `published`
- [x] change default locale to Chinese since Lily is not good at English
- add translation, keep translation validation error for now because it seems to time consuming
- `FileInput`:

  - show max file size in the helper test
  - show the remaining file slot in the main area
  - it seems still broken in some cases when adding and editing, maybe about form validation?

- [x] all table to sort by `updated_at` by default in FE

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
