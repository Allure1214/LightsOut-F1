# Formula 1 Website

A comprehensive Formula 1 website featuring real-time statistics, news, and articles.

## 🏎️ Features

### Statistics Dashboard
- **Driver & Constructor Standings** - Current season and historical data
- **Race Calendar** - Upcoming races with countdown timers
- **Race Results** - Detailed race analysis with qualifying, fastest laps, and DNFs
- **Driver/Team Profiles** - Comprehensive statistics and performance data
- **Head-to-Head Comparisons** - Driver vs driver analysis

### News & Articles
- **RSS Integration** - Automated news from F1.com, Autosport, and RaceFans
- **Custom Articles** - CMS system for race reviews and analysis
- **User Comments** - Interactive discussions and predictions
- **Search Functionality** - Full-text search across all content

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel + Railway/Supabase

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Allure1214/Formula-1.git
   cd Formula-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Setup

The application uses PostgreSQL with the following main entities:

- **Drivers** - F1 driver information and statistics
- **Teams** - Constructor data and performance
- **Races** - Race calendar and results
- **Results** - Detailed race results and statistics
- **Articles** - News and custom content
- **Comments** - User-generated content

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

### Data Sources

- **Ergast API** - Comprehensive F1 data (http://ergast.com/mrd/)
- **RSS Feeds** - News from official F1 sources
- **Custom Content** - User-generated articles and comments

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Hosting

- **Railway** - PostgreSQL hosting with easy setup
- **Supabase** - PostgreSQL with additional features
- **PlanetScale** - MySQL alternative

## 📊 API Endpoints

- `/api/drivers` - Driver data and statistics
- `/api/teams` - Team information and standings
- `/api/races` - Race calendar and results
- `/api/articles` - News and articles
- `/api/comments` - User comments and discussions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ergast API](http://ergast.com/mrd/) for comprehensive F1 data
- [Formula 1](https://www.formula1.com/) for official content
- [Autosport](https://www.autosport.com/) and [RaceFans](https://www.racefans.net/) for news feeds
