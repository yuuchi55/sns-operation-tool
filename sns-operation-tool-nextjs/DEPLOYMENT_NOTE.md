# Vercel Deployment Note

Your SNS operation tool has been successfully deployed to Vercel!

**Production URL**: https://sns-operation-tool-nextjs-kj2sr60ai-yuuchis-projects-60807ea5.vercel.app

## Important: Database Limitation

The current deployment uses SQLite (better-sqlite3) which has limitations on Vercel:
- SQLite databases are stored in the filesystem
- Vercel's serverless functions have ephemeral filesystems
- **Data will be lost between function invocations**

## Recommended Solutions for Production

1. **Use Turso** (SQLite-compatible edge database):
   - Sign up at https://turso.tech/
   - Create a database
   - Update your environment variables in Vercel:
     - `TURSO_DATABASE_URL`
     - `TURSO_AUTH_TOKEN`

2. **Use PostgreSQL** (via Vercel Postgres or Supabase):
   - Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
   - Supabase: https://supabase.com/

3. **Use PlanetScale** (MySQL-compatible):
   - Sign up at https://planetscale.com/

To update environment variables in Vercel:
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add the required variables based on your chosen database solution