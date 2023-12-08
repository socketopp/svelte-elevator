# Svelte Elevator Simulator

A simple elevator simulator built with SvelteKit, deployed on Cloudflare Pages, and using Cloudflare KV as its backend.

## Overview

This project is a simulation of an elevator system with the following features:

- Five elevators
- Twenty floors
- Efficient allocation and movement of elevators
- Visual representation of elevator positions

## Deployment

The project is deployed on [Cloudflare Pages](https://pages.cloudflare.com/) and utilizes [Cloudflare KV](https://www.cloudflare.com/products/workers-kv/) for its backend.

## Demo

See a live demo [https://sveltekit-elevator.pages.dev/](https://sveltekit-elevator.pages.dev/)

## Development

To run the project locally:

1. Install dependencies

```bash
npm install
```

2. Start the development server in two different terminals:

```bash
npm run dev
```

3. Run a proxy server.
   This is to setup a proxy for your Cloudflare KV to your remote config explained below (Using Cloudflare KV)

```bash
wrangler dev node_modules/wrangler-proxy/dist/worker.js --remote
```

Open your browser and navigate to http://localhost:5173 to view the application.

### Using Cloudflare KV

This project relies on Cloudflare KV for backend storage. Make sure to configure your KV namespace by following these steps:

1. Edit the `wrangler.toml` file with your own information:

```js
name = '[insert-name-here]';

compatibility_date = '2023-07-02';

account_id = '[account-id-here]'[[kv_namespaces]];
binding = 'ELEVATOR';
id = '[production-id]';
preview_id = '[preview_id]';
```
