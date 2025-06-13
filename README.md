# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f3be892c-1c88-496c-9be0-21f69de56308

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f3be892c-1c88-496c-9be0-21f69de56308) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Backend setup

The `backend` folder contains a small FastAPI application that lets you upload
PDFs and chat using a local language model. To run it locally:

```bash
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

By default the server expects a GPT4All model in `models/ggml-gpt4all-j.bin` or
you can provide a different path using the `LOCAL_MODEL_PATH` environment
variable. The server exposes two endpoints:

- `POST /upload` – send a PDF file and it will be indexed locally.
- `POST /chat` – send `{ "message": "..." }` to receive a text reply.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f3be892c-1c88-496c-9be0-21f69de56308) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
