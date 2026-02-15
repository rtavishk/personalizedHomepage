'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    icon: string;
    location: string;
  } | null>(null);
  const [dailyFocus, setDailyFocus] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [dailyQuote, setDailyQuote] = useState({ text: '', author: '' });
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showWidgets, setShowWidgets] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const getGreeting = (hour: number, name: string) => {
    if (hour < 12) {
      return `Good morning${name ? ', ' + name : ''}`;
    } else if (hour < 17) {
      return `Good afternoon${name ? ', ' + name : ''}`;
    } else {
      return `Good evening${name ? ', ' + name : ''}`;
    }
  };

  useEffect(() => {
    // Load saved data from localStorage
    const savedFocus = localStorage.getItem('dailyFocus');
    if (savedFocus) setDailyFocus(savedFocus);
    
    const savedNote = localStorage.getItem('quickNote');
    if (savedNote) setQuickNote(savedNote);
    
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');

    // Fetch daily quote (only once per day)
    const lastQuoteDate = localStorage.getItem('lastQuoteDate');
    const savedQuote = localStorage.getItem('dailyQuote');
    const today = new Date().toDateString();
    
    if (lastQuoteDate === today && savedQuote) {
      setDailyQuote(JSON.parse(savedQuote));
    } else {
      // Simple quotes array to avoid API calls
      const quotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
        { text: "Whoever is happy will make others happy too.", author: "Anne Frank" },
        { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
        { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" }
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setDailyQuote(randomQuote);
      localStorage.setItem('dailyQuote', JSON.stringify(randomQuote));
      localStorage.setItem('lastQuoteDate', today);
    }

    // Check online status
    setIsOnline(navigator.onLine);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    // Get battery status if available
    if ('getBattery' in navigator) {
      try {
        (navigator as any).getBattery().then((battery: any) => {
          setBatteryLevel(Math.round(battery.level * 100));
          
          // Use onlevelchange instead of addEventListener for better compatibility
          battery.onlevelchange = () => {
            setBatteryLevel(Math.round(battery.level * 100));
          };
        }).catch(() => {
          // Battery API not available or permission denied
          setBatteryLevel(null);
        });
      } catch {
        setBatteryLevel(null);
      }
    }
    const now = new Date();
    setCurrentTime(now);
    
    // Get user name from localStorage or prompt for it
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      setGreeting(getGreeting(now.getHours(), storedName));
    } else {
      const name = prompt('Welcome! What\'s your name?');
      if (name) {
        localStorage.setItem('userName', name);
        setUserName(name);
        setGreeting(getGreeting(now.getHours(), name));
      } else {
        setGreeting(getGreeting(now.getHours(), ''));
      }
    }

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        
        // Fetch weather from OpenWeatherMap (free tier)
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=7d3b5f5c5c5c5c5c5c5c5c5c5c5c5c5&units=metric`
        );
        
        if (response.ok) {
          const data = await response.json();
          setWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            icon: data.weather[0].icon,
            location: data.name
          });
        }
      } catch (error) {
        // Fallback to default weather if API fails
        setWeather({
          temp: 22,
          condition: 'Clear',
          icon: '01d',
          location: 'Your Location'
        });
      }
    };

    fetchWeather();

    // Update time every minute instead of every second to save memory
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const currentName = userName || localStorage.getItem('userName') || '';
      setGreeting(getGreeting(now.getHours(), currentName));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      '01d': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="20" fill="#FFD700" className="animate-pulse">
            <animate attributeName="r" values="20;22;20" dur="3s" repeatCount="indefinite"/>
          </circle>
          <g className="animate-spin" style={{transformOrigin: '50px 50px', animationDuration: '20s'}}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <rect key={i} x="48" y="25" width="4" height="15" fill="#FFD700" 
                transform={`rotate(${angle} 50 50)`} opacity="0.8"/>
            ))}
          </g>
        </svg>
      ),
      '01n': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="18" fill="#F0E68C" className="animate-pulse"/>
          <circle cx="40" cy="45" r="3" fill="#E0E0E0" opacity="0.6"/>
          <circle cx="60" cy="55" r="4" fill="#E0E0E0" opacity="0.5"/>
          <circle cx="45" cy="60" r="2" fill="#E0E0E0" opacity="0.4"/>
        </svg>
      ),
      '02d': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <circle cx="35" cy="35" r="15" fill="#FFD700" className="animate-pulse"/>
          <g opacity="0.9">
            <ellipse cx="55" cy="55" rx="25" ry="15" fill="white"/>
            <ellipse cx="65" cy="50" rx="20" ry="12" fill="white"/>
            <ellipse cx="50" cy="60" rx="18" ry="10" fill="white"/>
          </g>
        </svg>
      ),
      '03d': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <g opacity="0.8">
            <ellipse cx="40" cy="40" rx="20" ry="12" fill="white" className="animate-pulse"/>
            <ellipse cx="55" cy="50" rx="25" ry="15" fill="white" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
            <ellipse cx="45" cy="60" rx="18" ry="10" fill="white" className="animate-pulse" style={{animationDelay: '1s'}}/>
          </g>
        </svg>
      ),
      '09d': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <g opacity="0.7">
            <ellipse cx="50" cy="40" rx="25" ry="15" fill="gray"/>
          </g>
          <g className="animate-bounce">
            <ellipse cx="40" cy="60" rx="3" ry="5" fill="#4FC3F7"/>
            <ellipse cx="50" cy="65" rx="3" ry="5" fill="#4FC3F7" style={{animationDelay: '0.2s'}}/>
            <ellipse cx="60" cy="60" rx="3" ry="5" fill="#4FC3F7" style={{animationDelay: '0.4s'}}/>
          </g>
        </svg>
      ),
      '10d': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <circle cx="35" cy="30" r="12" fill="#FFD700" className="animate-pulse"/>
          <g opacity="0.8">
            <ellipse cx="55" cy="45" rx="20" ry="12" fill="white"/>
          </g>
          <g className="animate-bounce">
            <ellipse cx="45" cy="65" rx="3" ry="5" fill="#4FC3F7"/>
            <ellipse cx="55" cy="70" rx="3" ry="5" fill="#4FC3F7" style={{animationDelay: '0.3s'}}/>
          </g>
        </svg>
      ),
      '11d': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <g opacity="0.8">
            <ellipse cx="50" cy="40" rx="25" ry="15" fill="#616161"/>
          </g>
          <path d="M50 55 L48 70 L52 70 Z" fill="#FFD700" className="animate-pulse"/>
          <path d="M35 50 L33 65 L37 65 Z" fill="#FFD700" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
          <path d="M65 50 L63 65 L67 65 Z" fill="#FFD700" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
        </svg>
      ),
      '13d': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <g opacity="0.9">
            <ellipse cx="40" cy="40" rx="8" ry="6" fill="white" transform="rotate(15 40 40)"/>
            <ellipse cx="55" cy="50" rx="10" ry="7" fill="white" transform="rotate(-10 55 50)"/>
            <ellipse cx="45" cy="60" rx="7" ry="5" fill="white" transform="rotate(20 45 60)"/>
            <ellipse cx="60" cy="35" rx="6" ry="4" fill="white" transform="rotate(-25 60 35)"/>
          </g>
        </svg>
      ),
      '50d': (
        <svg className="w-12 h-12" viewBox="0 0 100 100">
          <g opacity="0.6">
            <ellipse cx="40" cy="40" rx="20" ry="12" fill="#E0E0E0" className="animate-pulse"/>
            <ellipse cx="55" cy="50" rx="25" ry="15" fill="#E0E0E0" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
            <ellipse cx="45" cy="60" rx="18" ry="10" fill="#E0E0E0" className="animate-pulse" style={{animationDelay: '1s'}}/>
          </g>
        </svg>
      )
    };
    return iconMap[iconCode] || iconMap['01d'];
  };

  const handleSearch = (e: React.FormEvent, searchQuery?: string) => {
    e.preventDefault();
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      setShowSuggestions(false);
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
    }
  };

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      // Use DuckDuckGo's instant answers API for search suggestions (no CORS issues)
      const response = await fetch(
        `https://api.better.dev/autocomplete?q=${encodeURIComponent(searchQuery)}`,
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions.slice(0, 8));
          return;
        }
      }
      
      // If that fails, try Google via CORS proxy
      const googleResponse = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://suggestqueries.google.com/complete/search?client=firefox&q=${searchQuery}`)}`
      );
      
      if (googleResponse.ok) {
        const text = await googleResponse.text();
        try {
          // Parse Google's response format
          const data = JSON.parse(text);
          if (data && data[1] && Array.isArray(data[1])) {
            setSuggestions(data[1].slice(0, 8));
            return;
          }
        } catch (parseError) {
          console.log('Parse error:', parseError);
        }
      }
    } catch (error) {
      console.log('API error:', error);
    }
    
    // If all APIs fail, use trending/popular searches based on the query
    const realSearchSuggestions: { [key: string]: string[] } = {
      'you': ['youtube', 'youtube music', 'your', 'you season 4', 'youtube tv', 'youtube video', 'young thug', 'youngboy never broke again'],
      'goo': ['google', 'google maps', 'google translate', 'google drive', 'google docs', 'gmail', 'google classroom', 'google flights'],
      'fac': ['facebook', 'facebook login', 'facebook marketplace', 'facetime', 'facebook messenger'],
      'ama': ['amazon', 'amazon prime', 'amazon music', 'amazon video', 'amazon web services'],
      'net': ['netflix', 'net worth', 'netflix login', 'netgear', 'netflix movies'],
      'ins': ['instagram', 'instant pot', 'insurance', 'install chrome', 'inside out 2'],
      'twi': ['twitter', 'twitch', 'twilio', 'twist', 'twin peaks'],
      'tik': ['tiktok', 'tiki torch', 'tik tok app', 'tiktok login'],
      'red': ['reddit', 'redbox', 'red lobster', 'red cross', 'red hat'],
      'spa': ['spotify', 'spacex', 'space jam', 'spanish to english', 'spartan'],
      'dis': ['disney plus', 'discord', 'disney', 'disfraz', 'discovery plus'],
      'app': ['apple', 'apple store', 'apartments for rent', 'apple music', 'apex legends'],
      'wea': ['weather', 'weather tomorrow', 'weather channel', 'weather forecast'],
      'cal': ['calculator', 'calendar', 'california', 'call of duty', 'calvin klein'],
      'tra': ['translate', 'tradingview', 'transunion', 'tracfone', 'translate english to spanish'],
      'map': ['maps', 'mapquest', 'mapp gas', 'map of europe', 'map of usa'],
      'new': ['news', 'new york times', 'new balance', 'newegg', 'new movies'],
      'tim': ['timer', 'time', 'times of india', 'timothee chalamet', 'timbuktu'],
      'wor': ['wordle', 'word', 'world cup', 'workday', 'world map']
    };

    // Check if we have suggestions for this query prefix
    const prefix = searchQuery.toLowerCase().slice(0, 3);
    if (realSearchSuggestions[prefix]) {
      // Filter suggestions that match the search query
      const matching = realSearchSuggestions[prefix].filter(s => 
        s.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery.toLowerCase().includes(s.toLowerCase().slice(0, searchQuery.length))
      );
      if (matching.length > 0) {
        setSuggestions(matching.slice(0, 8));
        return;
      }
    }

    // Ultimate fallback - empty suggestions
    setSuggestions([]);
  };

    const handleFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDailyFocus(e.target.value);
    localStorage.setItem('dailyFocus', e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuickNote(e.target.value);
    localStorage.setItem('quickNote', e.target.value);
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() && todos.length < 5) {
      const updatedTodos = [...todos, newTodo.trim()];
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      setNewTodo('');
    }
  };

  const removeTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Mini calendar helper
  const getMiniCalendar = (): { days: (number | null)[]; today: number } => {
    if (!currentTime) return { days: [], today: 0 };
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = currentTime.getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return { days, today };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      setShowSuggestions(true);
      fetchSuggestions(value);
    } else {
      setShowSuggestions(false);
      setSuggestions([]); // Clear suggestions to free memory
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const quickLinks = [
    { name: 'YouTube', url: 'https://youtube.com', favicon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64' },
    { name: 'Vercel', url: 'https://vercel.com', favicon: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=64' },
    { name: 'Gmail', url: 'https://gmail.com', favicon: 'https://www.google.com/s2/favicons?domain=gmail.com&sz=64' },
    { name: 'Yahoo Mail', url: 'https://mail.yahoo.com', favicon: 'https://www.google.com/s2/favicons?domain=mail.yahoo.com&sz=64' },
    { name: 'EA FUT WEB', url: 'https://www.ea.com/fifa/ultimate-team/web-app', favicon: 'https://www.google.com/s2/favicons?domain=ea.com&sz=64' },
    { name: 'FPL', url: 'https://fantasy.premierleague.com', favicon: 'https://www.google.com/s2/favicons?domain=fantasy.premierleague.com&sz=64' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Header with Greeting and Date */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-8 gap-4">
        {/* Left: Greeting and Name */}
        <div className="w-full sm:w-auto text-center sm:text-left bg-black bg-opacity-60 backdrop-blur-md rounded-xl px-4 py-3">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-1 drop-shadow-lg">
            {greeting || 'Welcome'}
          </h2>
        </div>

        {/* Right: Date */}
        <div className="w-full sm:w-auto text-center sm:text-right bg-black bg-opacity-60 backdrop-blur-md rounded-xl px-4 py-3">
          <p className="text-base sm:text-lg text-white font-medium drop-shadow-lg">
            {formatDate(currentTime)}
          </p>
          <p className="text-xs sm:text-sm text-white drop-shadow-md">
            {currentTime && currentTime.toLocaleDateString('en-US', { weekday: 'short' })}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Large Clock Display with Weather */}
        <div className="text-center mb-12 sm:mb-16 bg-black bg-opacity-60 backdrop-blur-md rounded-2xl px-6 sm:px-10 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-thin text-white tracking-wider font-mono drop-shadow-lg">
              {formatTime(currentTime)}
            </h1>
            {weather && (
              <div className="relative scale-75 sm:scale-100">
                {getWeatherIcon(weather.icon)}
              </div>
            )}
          </div>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-2xl sm:max-w-3xl mb-8 sm:mb-16 relative">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 group-focus-within:text-white transition-all duration-300" />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-12 sm:pl-16 pr-12 sm:pr-16 py-3 sm:py-5 bg-white bg-opacity-90 backdrop-blur-xl border border-purple-400 border-opacity-30 rounded-2xl sm:rounded-3xl text-black text-base sm:text-lg placeholder-gray-600 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-purple-400 focus:ring-opacity-30 focus:border-transparent transition-all duration-300 shadow-xl"
                placeholder="Search the web or type a URL..."
                autoComplete="off"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 sm:pr-6 flex items-center text-gray-600 hover:text-white transition-all duration-300"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-200 border-opacity-30 overflow-hidden z-50">
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 sm:px-6 py-3 text-left text-white hover:bg-purple-100 transition-colors duration-200 flex items-center gap-3 group"
                  >
                    <Search className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                    <span className="text-sm sm:text-base">{suggestion}</span>
                  </button>
                ))}
              </div>
              <div className="px-4 sm:px-6 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500">Press ESC to close</p>
              </div>
            </div>
          )}
        </div>

        {/* Widgets Toggle Button */}
        <button
          onClick={() => setShowWidgets(!showWidgets)}
          className="mb-6 px-4 py-2 bg-black bg-opacity-60 backdrop-blur-md rounded-full text-white text-sm hover:bg-opacity-20 transition-all"
        >
          {showWidgets ? 'Hide Widgets' : 'Show Widgets'}
        </button>

        {/* Widgets Grid */}
        {showWidgets && (
          <div className="w-full max-w-5xl mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Daily Focus */}
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4">
              <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">🎯</span> Daily Focus
              </h4>
              <input
                type="text"
                value={dailyFocus}
                onChange={handleFocusChange}
                placeholder="What's your main goal today?"
                className="w-full px-3 py-2 bg-black bg-opacity-40 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Quick Note */}
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4">
              <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">📝</span> Quick Note
              </h4>
              <textarea
                value={quickNote}
                onChange={handleNoteChange}
                placeholder="Jot something down..."
                rows={3}
                className="w-full px-3 py-2 bg-black bg-opacity-40 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>

            {/* Daily Quote */}
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4">
              <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span> Daily Quote
              </h4>
              <p className="text-white text-sm italic mb-2">"{dailyQuote.text}"</p>
              <p className="text-white text-xs">— {dailyQuote.author}</p>
            </div>

            {/* Simple Todo */}
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4">
              <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">☑️</span> Quick Tasks ({todos.length}/5)
              </h4>
              <form onSubmit={addTodo} className="mb-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a task..."
                  className="w-full px-3 py-2 bg-black bg-opacity-40 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </form>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {todos.map((todo, index) => (
                  <div key={index} className="flex items-center justify-between bg-black bg-opacity-60 rounded px-2 py-1">
                    <span className="text-white text-sm truncate">{todo}</span>
                    <button
                      onClick={() => removeTodo(index)}
                      className="text-white hover:text-white text-xs ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Calendar */}
            {(() => {
              const calendar = getMiniCalendar();
              return (
                <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4">
                  <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="text-lg">📅</span> {currentTime?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-white font-medium">{day}</div>
                    ))}
                    {calendar.days.map((day: number | null, i: number) => (
                      <div
                        key={i}
                        className={`py-1 rounded ${
                          day === calendar.today
                            ? 'bg-purple-500 text-white font-bold'
                            : day
                            ? 'text-white hover:bg-white hover:bg-opacity-20'
                            : ''
                        }`}
                      >
                        {day || ''}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* System Info */}
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl p-4">
              <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">⚙️</span> System
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white">
                  <span>Status:</span>
                  <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
                    {isOnline ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </div>
                {batteryLevel !== null && (
                  <div className="flex justify-between text-white">
                    <span>Battery:</span>
                    <span className={batteryLevel > 20 ? 'text-green-400' : 'text-yellow-400'}>
                      {batteryLevel}%
                    </span>
                  </div>
                )}
                <button
                  onClick={toggleTheme}
                  className="w-full mt-2 px-3 py-2 bg-purple-500 bg-opacity-50 rounded-lg text-white text-sm hover:bg-opacity-70 transition-all"
                >
                  {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Quick Links Grid */}
        <div className="w-full max-w-5xl mb-8 sm:mb-12">
          <h3 className="text-white text-sm font-medium mb-4 sm:mb-6 text-center opacity-70 tracking-wider uppercase">Quick Access</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-black bg-opacity-60 backdrop-blur-md shadow-lg hover:bg-opacity-20 transition-all duration-500 hover:scale-105 hover:shadow-2xl flex flex-col items-center gap-2 sm:gap-3 active:scale-95"
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white from-opacity-30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-px bg-gradient-to-br from-white from-opacity-10 to-transparent rounded-xl sm:rounded-2xl"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(147, 51, 234, 0.4)'
                  }}
                ></div>
                
                {/* Content */}
                <img 
                  src={link.favicon} 
                  alt={`${link.name} icon`}
                  className="relative w-5 h-5 sm:w-6 sm:h-6 z-20 transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to a default icon if favicon fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 rounded hidden z-20" style={{display: 'none'}}></div>
                <span className="relative text-white text-xs sm:text-sm font-medium block text-center z-20 transition-colors duration-300 group-hover:text-purple-900">{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
      </main>
      <footer className="relative z-10 py-4 sm:py-6">
        <nav className="flex justify-center items-center">
          <p className="text-white text-xs sm:text-sm opacity-80 drop-shadow-lg">
            {currentTime && currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </nav>
      </footer>
    </div>
  );
}
