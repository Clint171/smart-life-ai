# AI Chat

This repository is a simple AI chat application (frontend + Express backend) with MongoDB for persistence.

Environment variables (create a `.env` file):

- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET` - Secret for signing JWTs
- `SALT` - Number of bcrypt salt rounds (default 10)
- `GOOGLE_AI_API_KEY` - Google AI Studio API key (for Gemini)
- `GOOGLE_MODEL` - Gemini model name (e.g. `models/gemini-2.5-flash`)
- `GOOGLE_OAUTH_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_OAUTH_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_OAUTH_REDIRECT` - OAuth redirect URI (e.g. `http://localhost:3000/auth/google/callback`)

Notes:
- The frontend metadata and text were updated to remove smart-home-specific branding.
- The backend chat middleware currently returns a mock assistant response. Replace it with a call to Google Gemini (using `GOOGLE_AI_API_KEY` and `GOOGLE_MODEL`) when ready.
- Google OAuth endpoints are implemented at `/auth/google` and `/auth/google/callback`. Configure the OAuth client in Google Cloud Console and set `GOOGLE_OAUTH_REDIRECT` accordingly.

Recommended next steps:
- Wire the backend to call the Google Generative API for Gemini and stream responses.
- Securely store environment variables and enable HTTPS in production.