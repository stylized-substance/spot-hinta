# Spot-hinta

Price tracker for Finnish electricity prices built with Next.js and PostgreSQL

- Electricity price and production data is automatically collected from ENTSO-E and Fingrid REST APIs and saved to PostgreSQL using Github Actions
- Data is read from database and visualized to end-user
- Project runs on Vercel, new releases to this repository are automatically deployed
- Sentry.io integration - errors and other messages are sent to external log service