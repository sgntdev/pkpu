## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash

# install required library
npm install

# start in dev mode
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

## Prisma



```bash
# For first time run (load prisma from env)
npx prisma generate

# deploy schema
npx prisma migrate deploy

# delete existing schema and reupload all schema
npx prisma migrate reset
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
