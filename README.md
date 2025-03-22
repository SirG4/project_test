# Project Name

## Security Setup

1. Copy `.env.example` to `.env`
2. Fill in the environment variables in `.env` with your secure values
3. Never commit the `.env` file to version control
4. Make sure to set up proper authentication keys for Judge0 API

## Environment Variables

The following environment variables need to be configured:

- `API_SECRET_KEY`: Secret key for API authentication
- `JUDGE0_API_AUTH_KEY`: Authentication key for Judge0 API
- `JUDGE0_API_URL`: URL of your Judge0 instance
- Additional variables can be found in `.env.example`

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp .env.example .env
```

3. Edit `.env` with your secure values

4. Start the application:
```bash
npm start
```
