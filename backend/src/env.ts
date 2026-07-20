import dotenv from "dotenv";

// Loads backend/.env once. Import this first in every module that touches process.env.
// override: true so our .env wins over any stray ANTHROPIC_API_KEY already in the shell.
dotenv.config({ override: true });
