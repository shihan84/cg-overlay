import { db } from './db'

const defaultTemplates = [
  {
    name: 'Classic Lower Third',
    description: 'Clean and professional lower third for news broadcasts',
    type: 'LOWER_THIRD',
    category: 'News',
    htmlContent: `
      <div class="lower-third">
        <div class="content">
          <h1 class="title">{{title}}</h1>
          <p class="subtitle">{{subtitle}}</p>
          <p class="text">{{text}}</p>
        </div>
        {{#if imageUrl}}
        <div class="image">
          <img src="{{imageUrl}}" alt="Speaker" />
        </div>
        {{/if}}
      </div>
    `,
    cssContent: `
      .lower-third {
        position: absolute;
        bottom: 50px;
        left: 50px;
        right: 50px;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border-radius: 12px;
        padding: 20px 30px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .content {
        flex: 1;
      }
      
      .title {
        font-size: 28px;
        font-weight: bold;
        margin: 0 0 8px 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }
      
      .subtitle {
        font-size: 18px;
        margin: 0 0 4px 0;
        opacity: 0.9;
      }
      
      .text {
        font-size: 14px;
        margin: 0;
        opacity: 0.7;
      }
      
      .image img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid rgba(255, 255, 255, 0.2);
        margin-left: 20px;
      }
    `,
    config: {
      animation: {
        enter: 'slideInUp',
        exit: 'slideOutDown',
        duration: '0.5s'
      }
    },
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'TEXT',
        required: true,
        defaultValue: 'John Doe'
      },
      {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'TEXT',
        required: false,
        defaultValue: 'Senior Correspondent'
      },
      {
        name: 'text',
        label: 'Additional Text',
        type: 'TEXT',
        required: false,
        defaultValue: 'Live from the scene'
      },
      {
        name: 'imageUrl',
        label: 'Profile Image URL',
        type: 'TEXT',
        required: false
      }
    ]
  },
  {
    name: 'Breaking News Banner',
    description: 'Animated breaking news template with urgent styling',
    type: 'BREAKING_NEWS',
    category: 'News',
    htmlContent: `
      <div class="breaking-news">
        <div class="header">
          <div class="pulse-dot"></div>
          <span class="breaking-text">BREAKING NEWS</span>
          <div class="pulse-dot"></div>
        </div>
        <div class="content">
          <h1 class="headline">{{title}}</h1>
          <p class="description">{{text}}</p>
        </div>
      </div>
    `,
    cssContent: `
      .breaking-news {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        border-radius: 8px;
        padding: 20px 40px;
        color: white;
        text-align: center;
        box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4);
        border: 2px solid rgba(255, 255, 255, 0.2);
        min-width: 400px;
      }
      
      .header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
      }
      
      .pulse-dot {
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      }
      
      .pulse-dot:first-child {
        margin-right: 10px;
      }
      
      .pulse-dot:last-child {
        margin-left: 10px;
      }
      
      .breaking-text {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 2px;
      }
      
      .headline {
        font-size: 24px;
        font-weight: bold;
        margin: 0 0 10px 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      .description {
        font-size: 16px;
        margin: 0;
        opacity: 0.9;
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(0.8);
        }
      }
    `,
    config: {
      animation: {
        enter: 'fadeInDown',
        exit: 'fadeOutUp',
        duration: '0.4s'
      }
    },
    fields: [
      {
        name: 'title',
        label: 'Headline',
        type: 'TEXT',
        required: true,
        defaultValue: 'Major Event Unfolding'
      },
      {
        name: 'text',
        label: 'Description',
        type: 'TEXT',
        required: false,
        defaultValue: 'Stay tuned for updates'
      }
    ]
  },
  {
    name: 'News Ticker',
    description: 'Scrolling news ticker for bottom of screen',
    type: 'TICKER',
    category: 'News',
    htmlContent: `
      <div class="ticker">
        <div class="ticker-label">NEWS</div>
        <div class="ticker-content">
          <div class="ticker-text">{{text}}</div>
        </div>
      </div>
    `,
    cssContent: `
      .ticker {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%);
        height: 50px;
        display: flex;
        align-items: center;
        overflow: hidden;
        border-top: 2px solid rgba(255, 255, 255, 0.1);
      }
      
      .ticker-label {
        background: #dc2626;
        color: white;
        padding: 0 20px;
        height: 100%;
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 14px;
        letter-spacing: 1px;
      }
      
      .ticker-content {
        flex: 1;
        overflow: hidden;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
      }
      
      .ticker-text {
        white-space: nowrap;
        animation: scroll 30s linear infinite;
        color: white;
        font-size: 16px;
        padding-left: 100%;
      }
      
      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `,
    config: {
      animation: {
        enter: 'slideInUp',
        exit: 'slideOutDown',
        duration: '0.3s'
      }
    },
    fields: [
      {
        name: 'text',
        label: 'Ticker Text',
        type: 'TEXT',
        required: true,
        defaultValue: '• Latest headlines from around the world • Breaking news updates • Sports results • Weather forecast • Market updates •'
      }
    ]
  },
  {
    name: 'Sports Score Bug',
    description: 'Live sports score with team logos and time',
    type: 'SCOREBUG',
    category: 'Sports',
    htmlContent: `
      <div class="scorebug">
        <div class="team team-a">
          <div class="team-logo"></div>
          <div class="team-name">TEAM A</div>
          <div class="team-score">{{title}}</div>
        </div>
        <div class="vs-section">
          <div class="vs-text">VS</div>
          <div class="time">{{subtitle}}</div>
        </div>
        <div class="team team-b">
          <div class="team-logo"></div>
          <div class="team-name">TEAM B</div>
          <div class="team-score">{{text}}</div>
        </div>
      </div>
    `,
    cssContent: `
      .scorebug {
        position: absolute;
        top: 30px;
        right: 30px;
        background: rgba(15, 23, 42, 0.95);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 30px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      
      .team {
        text-align: center;
        color: white;
      }
      
      .team-logo {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 0 auto 10px;
      }
      
      .team-a .team-logo {
        background: #3b82f6;
      }
      
      .team-b .team-logo {
        background: #ef4444;
      }
      
      .team-name {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .team-score {
        font-size: 32px;
        font-weight: bold;
        line-height: 1;
      }
      
      .vs-section {
        text-align: center;
        color: white;
      }
      
      .vs-text {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
        opacity: 0.7;
      }
      
      .time {
        font-size: 14px;
        opacity: 0.7;
      }
    `,
    config: {
      animation: {
        enter: 'fadeIn',
        exit: 'fadeOut',
        duration: '0.3s'
      }
    },
    fields: [
      {
        name: 'title',
        label: 'Team A Score',
        type: 'TEXT',
        required: true,
        defaultValue: '0'
      },
      {
        name: 'subtitle',
        label: 'Time',
        type: 'TEXT',
        required: false,
        defaultValue: '45:00'
      },
      {
        name: 'text',
        label: 'Team B Score',
        type: 'TEXT',
        required: true,
        defaultValue: '0'
      }
    ]
  },
  {
    name: 'Weather Widget',
    description: 'Current weather conditions with forecast',
    type: 'WEATHER',
    category: 'Weather',
    htmlContent: `
      <div class="weather-widget">
        <div class="weather-icon">☀️</div>
        <div class="weather-info">
          <div class="label">CURRENT WEATHER</div>
          <div class="temperature">{{title}}</div>
          <div class="conditions">{{text}}</div>
        </div>
      </div>
    `,
    cssContent: `
      .weather-widget {
        position: absolute;
        top: 30px;
        left: 30px;
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        color: white;
        box-shadow: 0 8px 32px rgba(5, 150, 105, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .weather-icon {
        font-size: 48px;
      }
      
      .weather-info {
        display: flex;
        flex-direction: column;
      }
      
      .label {
        font-size: 12px;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 5px;
      }
      
      .temperature {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .conditions {
        font-size: 14px;
        opacity: 0.9;
      }
    `,
    config: {
      animation: {
        enter: 'slideInLeft',
        exit: 'slideOutLeft',
        duration: '0.4s'
      }
    },
    fields: [
      {
        name: 'title',
        label: 'Temperature',
        type: 'TEXT',
        required: true,
        defaultValue: '72°F'
      },
      {
        name: 'text',
        label: 'Conditions',
        type: 'TEXT',
        required: false,
        defaultValue: 'Partly Cloudy'
      }
    ]
  }
]

export async function seedDatabase() {
  try {
    console.log('Seeding database with default templates...')
    
    for (const templateData of defaultTemplates) {
      const existingTemplate = await db.template.findFirst({
        where: {
          name: templateData.name,
          type: templateData.type
        }
      })
      
      if (!existingTemplate) {
        await db.template.create({
          data: {
            name: templateData.name,
            description: templateData.description,
            type: templateData.type as any,
            category: templateData.category,
            htmlContent: templateData.htmlContent,
            cssContent: templateData.cssContent,
            config: templateData.config,
            isSystem: true,
            isActive: true,
            fields: {
              create: templateData.fields.map((field, index) => ({
                name: field.name,
                label: field.label,
                type: field.type as any,
                required: field.required,
                defaultValue: field.defaultValue,
                order: index
              }))
            }
          }
        })
        console.log(`Created template: ${templateData.name}`)
      } else {
        console.log(`Template already exists: ${templateData.name}`)
      }
    }
    
    console.log('Database seeding completed!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
}