# InitTrack

A web-based D&D 5e initiative tracker with integrated monster database. Track player characters and NPCs, manage hit points, and quickly add monsters from the Open5e API.

**Live Demo:** [https://blairacuda.github.io/inittrack](https://blairacuda.github.io/inittrack)

## Features

### Character & NPC Management
- **Add Characters**: Add empty character rows with a single click
- **NPC/PC Toggle**: Mark characters as NPCs or PCs (disables stat editing for PCs)
- **Edit Stats**: Update character name, initiative, armor class, max HP, and current HP
- **Delete Characters**: Remove individual characters from the tracker
- **Duplicate Characters**: Copy a character once or multiple times (useful for adding multiple identical enemies)
- **Auto-Select**: Input fields automatically select all text on focus for quick editing

### Initiative Tracking
- **Sort by Initiative**: Click the initiative header to cycle through three sort modes:
  - Unsorted (default)
  - Ascending (lowest to highest)
  - Descending (highest to lowest - standard D&D initiative order)
- **Visual Sort Indicator**: Icon changes to show current sort state

### Bestiary Integration
- **Monster Search**: Search through 2000+ monsters from the [Open5e API](https://open5e.com/)
- **Debounced Search**: Smart search that waits 500ms after you stop typing to reduce API calls
- **Pagination**: Browse through monster results with Previous/Next buttons
- **One-Click Add**: Click any monster to instantly add it to your initiative tracker with pre-filled stats
- **Loading States**: Visual feedback while monsters are loading
- **Error Handling**: Clear error messages if the API request fails

### Data Persistence
- **Manual Save**: Save your current session to browser localStorage with the save button
- **Auto-Load**: Automatically restores your last saved session when you return
- **Save Confirmation**: Visual "Saved!" message confirms successful save
- **Selective Reset**: Remove all NPCs while keeping player characters
- **Clear All**: Completely clear all characters and saved data (with confirmation prompt)

### Visual Health Tracking
- **Color-Coded HP**: Character rows change color based on remaining health:
  - **Red background**: ≤25% HP remaining (critical)
  - **Yellow background**: ≤50% HP remaining (bloodied)
  - **Default background**: >50% HP remaining (healthy)

### User Interface
- **Retro Styling**: NES.css provides a nostalgic 8-bit aesthetic
- **Icon-Based Actions**: FontAwesome icons for intuitive controls
- **Tooltips**: Hover over icons to see helpful descriptions
- **Responsive Grid Layout**: Clean, organized table layout
- **Browser-Based**: No installation required, works in any modern browser

## Tech Stack

- **React 18.3.1**: Modern React with hooks (useState, useReducer, useContext, useEffect, useRef)
- **Create React App**: Zero-config build tooling
- **FontAwesome 6**: Icon library for UI elements
- **NES.css 2.3.0**: Retro gaming-inspired CSS framework
- **Open5e API**: D&D 5e monster database
- **localStorage API**: Browser-based data persistence
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Static site hosting

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/blairacuda/inittrack.git
cd inittrack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

#### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page reloads when you make edits.

#### `npm test`
Launches the test runner in interactive watch mode.

#### `npm run build`
Builds the app for production to the `build` folder. The build is minified and optimized for performance.

## Usage Guide

### Adding Characters

**Empty Character:**
1. Click the **+** icon in the header
2. Fill in the character details

**From Bestiary:**
1. Type a monster name in the search box (e.g., "goblin")
2. Wait for search results to load (500ms debounce)
3. Click on the monster name to add it to your tracker
4. The monster's AC, HP, and name are automatically filled in

### Managing Initiative

1. Enter initiative values for each character
2. Click the sort icon next to "Init" to sort:
   - First click: Sort descending (standard D&D turn order)
   - Second click: Sort ascending
   - Third click: Return to unsorted
3. The icon changes to show current sort state (↕️ → ↑ → ↓)

### Tracking Combat

1. **Mark NPC/PC**: Check the "NPC" box to enable stat editing
2. **Update HP**: Modify the HP field as damage is taken or healing is applied
3. **Visual Feedback**: Row color changes automatically:
   - Yellow at 50% HP
   - Red at 25% HP
4. **Delete Defeated Enemies**: Click the trash icon to remove characters

### Duplicating Characters

**Single Copy:**
- Click the clipboard icon with "1" to duplicate a character once

**Multiple Copies:**
1. Click the clipboard icon with "#"
2. Enter the number of copies in the prompt
3. Click OK to create multiple identical characters (e.g., 5 goblins)

### Saving & Loading

**Save Progress:**
- Click the save icon (💾) in the header
- Watch for "Saved!" confirmation message
- Data is stored in your browser's localStorage

**Auto-Load:**
- Your last saved session automatically loads when you visit the site

**Reset Options:**
- **Trash icon (🗑️)**: Remove all NPCs, keep player characters
- **Ban icon (🚫)**: Clear everything including saved data (with confirmation)

## Project Structure

```
inittrack/
├── public/              # Static assets
├── src/
│   ├── component/       # React components
│   │   ├── App.js              # Main app component with state management
│   │   ├── HeaderCommands.js   # Save, reset, and add buttons
│   │   ├── InputTable.js       # Character grid and row management
│   │   └── Beastiary.js        # Monster search and API integration
│   ├── style/           # CSS files
│   │   ├── App.css
│   │   ├── HeaderCommands.css
│   │   ├── InputTable.css
│   │   └── Beastiary.css
│   ├── utilities/       # Helper functions
│   │   ├── ComponentUtils.js   # Custom hooks
│   │   └── Fetcher.js          # API fetch wrapper
│   ├── index.js         # React app entry point
│   └── App.test.js      # Test file
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions CI/CD pipeline
└── package.json         # Dependencies and scripts
```

## Development

### Key Components

**App.js**
- Main application state using `useReducer`
- Character list management
- localStorage integration
- Action dispatcher context

**HeaderCommands.js**
- Header controls (add, save, reset, clear all)
- Save confirmation messaging

**InputTable.js**
- Character grid display
- Inline editing
- Initiative sorting
- Character duplication
- Health-based color coding

**Beastiary.js**
- Open5e API integration
- Debounced search (500ms delay)
- Paginated results
- Loading and error states

### State Management

The app uses React's `useReducer` for centralized state management with the following actions:
- `initial`: Add empty character
- `add`: Add character from bestiary
- `update`: Update character property
- `remove`: Delete character
- `reset`: Remove all NPCs
- `sort`: Toggle initiative sort order
- `copy`: Duplicate character(s)
- `save`: Save to localStorage
- `clearAll`: Clear all data and storage

### API Integration

**Open5e API**
- Base URL: `https://api.open5e.com/monsters`
- Search: `?search={term}&page={pageNum}`
- Pagination: 50 results per page
- Response includes: name, armor_class, hit_points, slug

## Deployment

### Automated Deployment (GitHub Actions)

Every push to the `main` branch automatically:
1. Runs tests
2. Builds the production bundle
3. Deploys to GitHub Pages

**Workflow file:** `.github/workflows/deploy.yml`

### Manual Deployment

```bash
npm run build
# Deploy the build/ folder to your hosting provider
```

## Contributing

This is a personal project, but suggestions and bug reports are welcome! Feel free to open an issue on GitHub.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Open5e](https://open5e.com/) for the excellent D&D 5e API
- [NES.css](https://nostalgic-css.github.io/NES.css/) for the retro styling
- [Create React App](https://create-react-app.dev/) for the build tooling
- [FontAwesome](https://fontawesome.com/) for the icon library
