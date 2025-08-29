# CG Overlay Studio

A professional browser-based CG (Character Generator) overlay system for OBS Studio, inspired by SPX CG and UNO broadcasting templates. This system provides real-time control over broadcast graphics with a modern, intuitive interface.

## Features

### 🎬 Professional Broadcasting Templates
- **Lower Thirds** - Classic news-style name titles and information
- **Breaking News** - Animated urgent news banners with pulsing effects
- **News Ticker** - Scrolling headlines for continuous information
- **Score Bug** - Live sports scores with team logos and timing
- **Weather Widget** - Current conditions and forecasts
- **Fullscreen Graphics** - Complete screen overlays for major announcements
- **Social Media** - Live social media integration
- **Logo Bug** - Channel branding and identification

### 🚀 Real-time Control
- **Live Updates** - Change overlay content instantly during broadcasts
- **WebSocket Communication** - Bidirectional real-time data sync
- **OBS Integration** - Direct browser source URLs for OBS Studio
- **Preview System** - Test overlays before going live
- **Smooth Animations** - Professional transitions and effects

### 🏢 Client Management
- **Multi-client Support** - Manage different broadcasting clients
- **Branding** - Custom colors and logos per client
- **Organization** - Group overlays by client and broadcast
- **Permissions** - Client-specific access control

### 📊 Dashboard Features
- **Modern UI** - Clean, responsive interface with shadcn/ui
- **Template Library** - Browse and manage overlay templates
- **Overlay Control** - Real-time editing and visibility control
- **Broadcast Sessions** - Organize overlays into scheduled broadcasts
- **Statistics** - Monitor active overlays and broadcast status

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **Socket.IO Client** - Real-time communication
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - Server runtime
- **Express** - Web framework
- **Socket.IO** - WebSocket server
- **Prisma ORM** - Database management
- **SQLite** - Lightweight database

### Infrastructure
- **RESTful API** - CRUD operations
- **WebSocket Server** - Real-time updates
- **Database Seeding** - Pre-populated templates
- **Type Safety** - End-to-end TypeScript

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shihan84/cg-overlay.git
   cd cg-overlay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## OBS Studio Integration

### Adding Overlays to OBS

1. **Create Browser Source**
   - In OBS, right-click in your scene
   - Select "Add" → "Browser"

2. **Configure Source**
   - Copy the overlay URL from the dashboard
   - Paste it into the URL field
   - Set width and height (typically 1920x1080)

3. **Customize Settings**
   - Enable "Refresh browser when scene becomes active"
   - Set custom CSS if needed
   - Configure framerate (30 or 60 FPS)

### Real-time Control

1. **Open Overlay Control**
   - Go to the Overlay Management tab
   - Click "Control" on any overlay
   - Use the live control panel to update content

2. **Live Updates**
   - Changes appear instantly in OBS
   - Show/hide overlays with smooth transitions
   - Modify colors, text, and styling in real-time

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main dashboard
│   ├── overlay/[id]/page.tsx        # OBS overlay display
│   └── api/                        # REST API endpoints
├── components/
│   ├── client-form.tsx             # Client management
│   ├── template-manager.tsx        # Template library
│   ├── overlay-manager.tsx         # Overlay management
│   ├── broadcast-manager.tsx       # Broadcast sessions
│   ├── overlay-control.tsx         # Real-time control
│   └── template-preview.tsx        # Template preview
├── lib/
│   ├── socket.ts                   # WebSocket server
│   ├── db.ts                      # Database client
│   └── seed.ts                    # Database seeding
└── prisma/
    └── schema.prisma               # Database schema
```

## API Endpoints

### Clients
- `GET /api/client` - Get all clients
- `POST /api/client` - Create new client
- `GET /api/client/[id]` - Get specific client
- `PUT /api/client/[id]` - Update client
- `DELETE /api/client/[id]` - Delete client

### Templates
- `GET /api/template` - Get all templates
- `POST /api/template` - Create new template

### Overlays
- `GET /api/overlay` - Get all overlays
- `POST /api/overlay` - Create new overlay
- `GET /api/overlay/[id]` - Get specific overlay
- `PUT /api/overlay/[id]` - Update overlay
- `DELETE /api/overlay/[id]` - Delete overlay

## WebSocket Events

### Client to Server
- `join-overlay` - Join overlay room
- `update-overlay` - Update overlay data
- `toggle-visibility` - Show/hide overlay
- `update-template-config` - Update template configuration

### Server to Client
- `overlay-update` - Overlay data changed
- `overlay-visibility` - Visibility status changed
- `template-config` - Template configuration updated

## Configuration

### Environment Variables
Create a `.env.local` file:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

### Database Configuration
The system uses SQLite by default. To use a different database:

1. Update `DATABASE_URL` in `.env.local`
2. Install the appropriate database driver
3. Update `schema.prisma` if needed
4. Run `npm run db:push`

## Templates

### Included Templates

1. **Classic Lower Third**
   - Professional news-style overlay
   - Fields: title, subtitle, text, image URL

2. **Breaking News Banner**
   - Animated urgent news alert
   - Fields: headline, description

3. **News Ticker**
   - Scrolling headlines
   - Fields: ticker text

4. **Sports Score Bug**
   - Live sports scores
   - Fields: team A score, time, team B score

5. **Weather Widget**
   - Current conditions
   - Fields: temperature, conditions

### Custom Templates

Create custom templates by:

1. Adding template records to the database
2. Defining HTML/CSS content
3. Configuring form fields
4. Setting up validation rules

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database URL
- Set up proper WebSocket server URL
- Configure CORS for production domains

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## Acknowledgments

- Inspired by SPX CG and UNO broadcasting systems
- Built with modern web technologies
- Designed for professional broadcasting environments

---

**CG Overlay Studio** - Professional broadcasting graphics made simple.