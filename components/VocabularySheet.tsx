import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Printer, 
  Plus, 
  Search, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  PlusCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  User,
  Sun,
  MapPin,
  Columns,
  BedDouble,
  Briefcase,
  Home,
  Coffee,
  Apple,
  TreePine,
  Train,
  Heart,
  Users,
  GraduationCap,
  Laptop,
  Globe,
  GlassWater,
  Droplets,
  Smile,
  Car,
  Smartphone,
  Calendar,
  Building2,
  Utensils,
  Navigation,
  School,
  Clock,
  Music,
  Landmark,
  Languages,
  BookMarked
} from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

// Noun category types
export type NounCategory = 'Masculine' | 'Neuter' | 'Feminine' | 'Plural';

export interface VocabularyWord {
  id: string;
  article: 'der' | 'das' | 'die';
  noun: string;
  translation: string;
  category: NounCategory;
  chapter: string;
  iconName?: string;
  isCustom?: boolean;
}

// Initial preloaded words based on Chapters of German A1 syllabus
const INITIAL_VOCABULARY: VocabularyWord[] = [
  // MASCULINE (der) - Blue Background
  { id: 'm1', article: 'der', noun: 'Name', translation: 'Name', category: 'Masculine', chapter: 'Chapter 1: Greetings & Intro', iconName: 'User' },
  { id: 'm2', article: 'der', noun: 'Tag', translation: 'Day', category: 'Masculine', chapter: 'Chapter 1: Greetings & Intro', iconName: 'Sun' },
  { id: 'm3', article: 'der', noun: 'Bahnhof', translation: 'Train Station', category: 'Masculine', chapter: 'Chapter 4: Places & Travel', iconName: 'MapPin' },
  { id: 'm4', article: 'der', noun: 'Tisch', translation: 'Table', category: 'Masculine', chapter: 'Chapter 2: Housing & Living', iconName: 'Columns' },
  { id: 'm5', article: 'der', noun: 'Balkon', translation: 'Balcony', category: 'Masculine', chapter: 'Chapter 2: Housing & Living', iconName: 'Sun' },
  { id: 'm6', article: 'der', noun: 'Kaffee', translation: 'Coffee', category: 'Masculine', chapter: 'Chapter 3: Food & Drinks', iconName: 'Coffee' },
  { id: 'm7', article: 'der', noun: 'Apfel', translation: 'Apple', category: 'Masculine', chapter: 'Chapter 3: Food & Drinks', iconName: 'Apple' },
  { id: 'm8', article: 'der', noun: 'Park', translation: 'Park', category: 'Masculine', chapter: 'Chapter 4: Places & Travel', iconName: 'TreePine' },
  { id: 'm9', article: 'der', noun: 'Zug', translation: 'Train', category: 'Masculine', chapter: 'Chapter 4: Places & Travel', iconName: 'Train' },
  { id: 'm10', article: 'der', noun: 'Vater', translation: 'Father', category: 'Masculine', chapter: 'Chapter 5: Family & Jobs', iconName: 'Heart' },
  { id: 'm11', article: 'der', noun: 'Freund', translation: 'Friend (male)', category: 'Masculine', chapter: 'Chapter 5: Family & Jobs', iconName: 'Users' },
  { id: 'm12', article: 'der', noun: 'Beruf', translation: 'Profession', category: 'Masculine', chapter: 'Chapter 5: Family & Jobs', iconName: 'Briefcase' },
  { id: 'm13', article: 'der', noun: 'Lehrer', translation: 'Teacher (male)', category: 'Masculine', chapter: 'Chapter 5: Family & Jobs', iconName: 'GraduationCap' },
  { id: 'm14', article: 'der', noun: 'Computer', translation: 'Computer', category: 'Masculine', chapter: 'Chapter 6: Daily Work', iconName: 'Laptop' },

  // NEUTER (das) - Green Background
  { id: 'n1', article: 'das', noun: 'Hotel', translation: 'Hotel', category: 'Neuter', chapter: 'Chapter 4: Places & Travel', iconName: 'BedDouble' },
  { id: 'n2', article: 'das', noun: 'Land', translation: 'Country', category: 'Neuter', chapter: 'Chapter 1: Greetings & Intro', iconName: 'Globe' },
  { id: 'n3', article: 'das', noun: 'Haus', translation: 'House', category: 'Neuter', chapter: 'Chapter 2: Housing & Living', iconName: 'Home' },
  { id: 'n4', article: 'das', noun: 'Bett', translation: 'Bed', category: 'Neuter', chapter: 'Chapter 2: Housing & Living', iconName: 'BedDouble' },
  { id: 'n5', article: 'das', noun: 'Buch', translation: 'Book', category: 'Neuter', chapter: 'Chapter 6: Daily Work', iconName: 'BookOpen' },
  { id: 'n6', article: 'das', noun: 'Büro', translation: 'Office', category: 'Neuter', chapter: 'Chapter 6: Daily Work', iconName: 'Briefcase' },
  { id: 'n7', article: 'das', noun: 'Brot', translation: 'Bread', category: 'Neuter', chapter: 'Chapter 3: Food & Drinks', iconName: 'Apple' },
  { id: 'n8', article: 'das', noun: 'Wasser', translation: 'Water', category: 'Neuter', chapter: 'Chapter 3: Food & Drinks', iconName: 'Droplets' },
  { id: 'n9', article: 'das', noun: 'Bier', translation: 'Beer', category: 'Neuter', chapter: 'Chapter 3: Food & Drinks', iconName: 'GlassWater' },
  { id: 'n10', article: 'das', noun: 'Kind', translation: 'Child', category: 'Neuter', chapter: 'Chapter 5: Family & Jobs', iconName: 'Smile' },
  { id: 'n11', article: 'das', noun: 'Auto', translation: 'Car', category: 'Neuter', chapter: 'Chapter 4: Places & Travel', iconName: 'Car' },
  { id: 'n12', article: 'das', noun: 'Handy', translation: 'Mobile Phone', category: 'Neuter', chapter: 'Chapter 6: Daily Work', iconName: 'Smartphone' },
  { id: 'n13', article: 'das', noun: 'Jahr', translation: 'Year', category: 'Neuter', chapter: 'Chapter 6: Daily Work', iconName: 'Calendar' },

  // FEMININE (die) - Red Background
  { id: 'f1', article: 'die', noun: 'Kirche', translation: 'Church', category: 'Feminine', chapter: 'Chapter 4: Places & Travel', iconName: 'Building2' },
  { id: 'f2', article: 'die', noun: 'Person', translation: 'Person', category: 'Feminine', chapter: 'Chapter 1: Greetings & Intro', iconName: 'User' },
  { id: 'f3', article: 'die', noun: 'Wohnung', translation: 'Apartment', category: 'Feminine', chapter: 'Chapter 2: Housing & Living', iconName: 'Home' },
  { id: 'f4', article: 'die', noun: 'Küche', translation: 'Kitchen', category: 'Feminine', chapter: 'Chapter 2: Housing & Living', iconName: 'Utensils' },
  { id: 'f5', article: 'die', noun: 'Straße', translation: 'Street', category: 'Feminine', chapter: 'Chapter 4: Places & Travel', iconName: 'Navigation' },
  { id: 'f6', article: 'die', noun: 'Mutter', translation: 'Mother', category: 'Feminine', chapter: 'Chapter 5: Family & Jobs', iconName: 'Heart' },
  { id: 'f7', article: 'die', noun: 'Freundin', translation: 'Friend (female)', category: 'Feminine', chapter: 'Chapter 5: Family & Jobs', iconName: 'Users' },
  { id: 'f8', article: 'die', noun: 'Schule', translation: 'School', category: 'Feminine', chapter: 'Chapter 6: Daily Work', iconName: 'School' },
  { id: 'f9', article: 'die', noun: 'Zeit', translation: 'Time', category: 'Feminine', chapter: 'Chapter 6: Daily Work', iconName: 'Clock' },
  { id: 'f10', article: 'die', noun: 'Milch', translation: 'Milk', category: 'Feminine', chapter: 'Chapter 3: Food & Drinks', iconName: 'GlassWater' },
  { id: 'f11', article: 'die', noun: 'Tomate', translation: 'Tomato', category: 'Feminine', chapter: 'Chapter 3: Food & Drinks', iconName: 'Apple' },
  { id: 'f12', article: 'die', noun: 'Musik', translation: 'Music', category: 'Feminine', chapter: 'Chapter 1: Greetings & Intro', iconName: 'Music' },
  { id: 'f13', article: 'die', noun: 'Stadt', translation: 'City', category: 'Feminine', chapter: 'Chapter 4: Places & Travel', iconName: 'Landmark' },
  { id: 'f14', article: 'die', noun: 'Sprache', translation: 'Language', category: 'Feminine', chapter: 'Chapter 1: Greetings & Intro', iconName: 'Languages' },

  // PLURAL (die with plural ending) - Black Background / White text
  { id: 'p1', article: 'die', noun: 'Häuser', translation: 'Houses', category: 'Plural', chapter: 'Chapter 4: Places & Travel', iconName: 'Home' },
  { id: 'p2', article: 'die', noun: 'Kinder', translation: 'Children', category: 'Plural', chapter: 'Chapter 5: Family & Jobs', iconName: 'Smile' },
  { id: 'p3', article: 'die', noun: 'Bücher', translation: 'Books', category: 'Plural', chapter: 'Chapter 6: Daily Work', iconName: 'BookOpen' },
  { id: 'p4', article: 'die', noun: 'Autos', translation: 'Cars', category: 'Plural', chapter: 'Chapter 4: Places & Travel', iconName: 'Car' },
  { id: 'p5', article: 'die', noun: 'Hotels', translation: 'Hotels', category: 'Plural', chapter: 'Chapter 4: Places & Travel', iconName: 'BedDouble' },
  { id: 'p6', article: 'die', noun: 'Äpfel', translation: 'Apples', category: 'Plural', chapter: 'Chapter 3: Food & Drinks', iconName: 'Apple' },
  { id: 'p7', article: 'die', noun: 'Tomaten', translation: 'Tomatoes', category: 'Plural', chapter: 'Chapter 3: Food & Drinks', iconName: 'Apple' },
  { id: 'p8', article: 'die', noun: 'Berufe', translation: 'Professions', category: 'Plural', chapter: 'Chapter 5: Family & Jobs', iconName: 'Briefcase' },
  { id: 'p9', article: 'die', noun: 'Tage', translation: 'Days', category: 'Plural', chapter: 'Chapter 1: Greetings & Intro', iconName: 'Calendar' },
  { id: 'p10', article: 'die', noun: 'Wohnungen', translation: 'Apartments', category: 'Plural', chapter: 'Chapter 2: Housing & Living', iconName: 'Home' },
  { id: 'p11', article: 'die', noun: 'Sprachen', translation: 'Languages', category: 'Plural', chapter: 'Chapter 1: Greetings & Intro', iconName: 'Languages' },
  { id: 'p12', article: 'die', noun: 'Freunde', translation: 'Friends', category: 'Plural', chapter: 'Chapter 5: Family & Jobs', iconName: 'Users' },
  { id: 'p13', article: 'die', noun: 'Städte', translation: 'Cities', category: 'Plural', chapter: 'Chapter 4: Places & Travel', iconName: 'Landmark' },
  { id: 'p14', article: 'die', noun: 'Büros', translation: 'Offices', category: 'Plural', chapter: 'Chapter 6: Daily Work', iconName: 'Briefcase' }
];

const CHAPTERS = [
  'All Chapters',
  'Chapter 1: Greetings & Intro',
  'Chapter 2: Housing & Living',
  'Chapter 3: Food & Drinks',
  'Chapter 4: Places & Travel',
  'Chapter 5: Family & Jobs',
  'Chapter 6: Daily Work'
];

// Helper to render lucide icon component dynamically
const RenderWordIcon = ({ name, className }: { name: string; className?: string }) => {
  const props = { size: 18, className };
  switch (name) {
    case 'User': return <User {...props} />;
    case 'Sun': return <Sun {...props} />;
    case 'MapPin': return <MapPin {...props} />;
    case 'Columns': return <Columns {...props} />;
    case 'BedDouble': return <BedDouble {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'Home': return <Home {...props} />;
    case 'Coffee': return <Coffee {...props} />;
    case 'Apple': return <Apple {...props} />;
    case 'TreePine': return <TreePine {...props} />;
    case 'Train': return <Train {...props} />;
    case 'Heart': return <Heart {...props} />;
    case 'Users': return <Users {...props} />;
    case 'GraduationCap': return <GraduationCap {...props} />;
    case 'Laptop': return <Laptop {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'GlassWater': return <GlassWater {...props} />;
    case 'Droplets': return <Droplets {...props} />;
    case 'Smile': return <Smile {...props} />;
    case 'Car': return <Car {...props} />;
    case 'Smartphone': return <Smartphone {...props} />;
    case 'Calendar': return <Calendar {...props} />;
    case 'Building2': return <Building2 {...props} />;
    case 'Utensils': return <Utensils {...props} />;
    case 'Navigation': return <Navigation {...props} />;
    case 'School': return <School {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'Music': return <Music {...props} />;
    case 'Landmark': return <Landmark {...props} />;
    case 'Languages': return <Languages {...props} />;
    default: return <HelpCircle {...props} />;
  }
};

export const VocabularySheet: React.FC = () => {
  const [vocab, setVocab] = useState<VocabularyWord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('All Chapters');
  
  // TTS State
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  
  // New word form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({
    article: 'der' as 'der' | 'das' | 'die',
    noun: '',
    translation: '',
    category: 'Masculine' as NounCategory,
    chapter: 'Chapter 1: Greetings & Intro',
    iconName: 'User'
  });

  useEffect(() => {
    const saved = localStorage.getItem('lingu-vocab-book-v1');
    if (saved) {
      try {
        setVocab(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load local vocabulary, using defaults', e);
        setVocab(INITIAL_VOCABULARY);
      }
    } else {
      setVocab(INITIAL_VOCABULARY);
    }
  }, []);

  const saveVocab = (newList: VocabularyWord[]) => {
    setVocab(newList);
    localStorage.setItem('lingu-vocab-book-v1', JSON.stringify(newList));
  };

  const handleSpeak = async (word: VocabularyWord) => {
    const phrase = `${word.article} ${word.noun}`;
    setSpeakingWordId(word.id);
    
    try {
      // First try standard Web Speech Synthesis for high-fidelity offline/immediate playback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'de-DE';
        utterance.rate = 0.85; // A1 learners prefer clear, slightly slower speech
        
        // Find German voice if available
        const voices = window.speechSynthesis.getVoices();
        const deVoice = voices.find(v => v.lang.startsWith('de'));
        if (deVoice) {
          utterance.voice = deVoice;
        }

        utterance.onend = () => setSpeakingWordId(null);
        utterance.onerror = () => setSpeakingWordId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback to Gemini TTS
        await generateSpeech(phrase, 'Kore');
        setSpeakingWordId(null);
      }
    } catch (err) {
      console.error('Pronunciation Error:', err);
      // fallback fallback
      setSpeakingWordId(null);
    }
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.noun || !newWord.translation) return;

    const added: VocabularyWord = {
      id: 'custom-' + Date.now(),
      article: newWord.article,
      noun: newWord.noun.trim(),
      translation: newWord.translation.trim(),
      category: newWord.category,
      chapter: newWord.chapter,
      iconName: newWord.iconName,
      isCustom: true
    };

    const updated = [...vocab, added];
    saveVocab(updated);
    
    // Clear form
    setNewWord({
      article: 'der',
      noun: '',
      translation: '',
      category: 'Masculine',
      chapter: 'Chapter 1: Greetings & Intro',
      iconName: 'User'
    });
    setShowAddForm(false);
  };

  const handleDeleteWord = (id: string) => {
    const updated = vocab.filter(w => w.id !== id);
    saveVocab(updated);
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to restore the default syllabus vocabulary? All custom added words will be removed.')) {
      saveVocab(INITIAL_VOCABULARY);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered vocabulary lists per category
  const getFilteredList = (category: NounCategory) => {
    return vocab.filter(w => {
      if (w.category !== category) return false;
      
      const matchesChapter = selectedChapter === 'All Chapters' || w.chapter === selectedChapter;
      const cleanSearch = search.toLowerCase();
      const matchesSearch = search === '' || 
        w.noun.toLowerCase().includes(cleanSearch) || 
        w.translation.toLowerCase().includes(cleanSearch);
      
      return matchesChapter && matchesSearch;
    });
  };

  const masculineList = getFilteredList('Masculine');
  const neuterList = getFilteredList('Neuter');
  const feminineList = getFilteredList('Feminine');
  const pluralList = getFilteredList('Plural');

  const totalFilteredCount = masculineList.length + neuterList.length + feminineList.length + pluralList.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. SYLLABUS SECTION HEADER */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm uppercase tracking-wider mb-2">
            <BookMarked size={18} />
            <span>Official Syllabus & Course Work</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            German A1 Beginner Vocabulary Book
          </h2>
          <p className="text-slate-500 mt-2 font-medium max-w-2xl">
            This specialized curriculum companion is synchronized with the chapters of the online syllabus book. Learn to recognize gender category colors instantly—the ultimate strategy for mastering German noun articles!
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a 
              href="https://online.fliphtml5.com/mkzfx/phnn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors border border-slate-200"
            >
              <ExternalLink size={14} />
              Open Original Flipbook
            </a>
            <span className="text-xs text-slate-400 font-semibold">•</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full font-bold">
              Level A1 Beginner
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full font-bold">
              Interactive Audio Pronunciation
            </span>
          </div>
        </div>
        
        {/* Controls block */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-heavy rounded-xl text-sm shadow-md transition-all font-black"
          >
            <Plus size={18} />
            Add Vocabulary
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-black text-white font-heavy rounded-xl text-sm shadow-md transition-all font-black"
          >
            <Printer size={18} />
            Print Poster (A4)
          </button>
        </div>
      </div>

      {/* Adding custom vocabulary modal/form overlay */}
      {showAddForm && (
        <div className="relative bg-white p-6 md:p-8 rounded-3xl border-2 border-indigo-500 shadow-xl print:hidden animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
              <PlusCircle className="text-indigo-600" /> Add Custom Word to Syllabus
            </h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleAddWord} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Category (Gender)</label>
              <select
                value={newWord.category}
                onChange={(e) => {
                  const cat = e.target.value as NounCategory;
                  let art: 'der' | 'das' | 'die' = 'der';
                  if (cat === 'Neuter') art = 'das';
                  if (cat === 'Feminine' || cat === 'Plural') art = 'die';
                  setNewWord({ ...newWord, category: cat, article: art });
                }}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-bold"
              >
                <option value="Masculine">Masculine (der)</option>
                <option value="Neuter">Neuter (das)</option>
                <option value="Feminine">Feminine (die)</option>
                <option value="Plural">Plural (die plural)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">German Noun (Ex. Bahnhof)</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1">
                <span className="text-slate-400 font-bold mr-2 text-sm">{newWord.article}</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bahnhof"
                  value={newWord.noun}
                  onChange={(e) => setNewWord({ ...newWord, noun: e.target.value })}
                  className="w-full bg-transparent p-1.5 text-sm font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">English Translation</label>
              <input
                type="text"
                required
                placeholder="e.g. Train Station"
                value={newWord.translation}
                onChange={(e) => setNewWord({ ...newWord, translation: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Syllabus Chapter</label>
              <select
                value={newWord.chapter}
                onChange={(e) => setNewWord({ ...newWord, chapter: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-bold"
              >
                {CHAPTERS.slice(1).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Save Word
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. FILTER & SEARCH SHELF */}
      <div className="bg-slate-100 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {CHAPTERS.map(ch => (
            <button
              key={ch}
              onClick={() => setSelectedChapter(ch)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedChapter === ch 
                  ? 'bg-white shadow-md text-slate-900 border border-slate-200 font-extrabold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search word / English meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* 3. PRINTABLE WORKBOOK COVER / POSTER DESIGN (Portrait A4 structured) */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden p-6 md:p-12 max-w-[21cm] mx-auto print:shadow-none print:border-none print:p-0 print:m-0 printable-vocabulary-sheet relative">
        
        {/* Poster Watermark / Header decoration */}
        <div className="border-b-4 border-double border-slate-100 pb-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-2xl print:bg-slate-900">
              <Languages size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">
                Deutsch - Artikel & Plural
              </h1>
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mt-1">
                German Nouns & Plurals Study Poster • Learn Level A1
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black border-2 border-slate-900 px-2 py-1 rounded bg-amber-50">
              A1 Companion Course
            </span>
          </div>
        </div>

        {totalFilteredCount === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">No words found matching the current layout search.</p>
            <button onClick={() => { setSearch(''); setSelectedChapter('All Chapters'); }} className="mt-4 text-indigo-600 font-extrabold text-sm underline">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* 1. MASCULINE (der) BLOCK - BLUE BACKGROUND */}
            {masculineList.length > 0 && (
              <div className="vocab-section animate-in fade-in duration-300">
                <div className="bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between mb-4 shadow-sm print:bg-blue-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">1. Maskulin (Masculine)</span>
                    <span className="text-xs bg-white/20 border border-white/20 px-2 py-0.5 rounded-full font-bold">
                      der
                    </span>
                  </div>
                  <span className="text-xs font-black tracking-widest">
                    {masculineList.length} WORDS
                  </span>
                </div>
                
                {/* Spaced card list designed to leave enough room to write on/add notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                  {masculineList.map(w => (
                    <div 
                      key={w.id} 
                      className="group flex flex-col justify-between bg-blue-50/50 hover:bg-blue-50 border border-blue-100 p-4 rounded-xl transition-all relative overflow-hidden h-[95px] cursor-pointer"
                      onClick={() => handleSpeak(w)}
                    >
                      <div className="absolute right-2 top-2 opacity-10 group-hover:opacity-30 transition-opacity">
                        {w.iconName && <RenderWordIcon name={w.iconName} className="text-blue-900" />}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-blue-500 uppercase tracking-wider">der</span>
                        <span className="text-lg font-black text-blue-900 leading-tight">{w.noun}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-100/40">
                        <span className="text-xs font-medium text-slate-500">{w.translation}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            className={`p-1 rounded-lg text-blue-600 bg-white shadow-sm border border-blue-200 transition-all ${
                              speakingWordId === w.id ? 'animate-bounce text-emerald-600' : 'hover:scale-105'
                            }`}
                            title="Speak Pronunciation"
                          >
                            <Volume2 size={12} />
                          </button>
                          {w.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWord(w.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors bg-white shadow-sm border border-slate-200"
                              title="Delete Word"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty dashed card to look visually pleasing and encourage adding new vocabulary */}
                  <div 
                    onClick={() => setShowAddForm(true)}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white hover:bg-blue-50/20 text-blue-400 p-4 rounded-xl transition-all cursor-pointer h-[95px] print:hidden"
                  >
                    <Plus size={18} className="mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Add Masculine Noun</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. NEUTER (das) BLOCK - GREEN BACKGROUND */}
            {neuterList.length > 0 && (
              <div className="vocab-section animate-in fade-in duration-300">
                <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between mb-4 shadow-sm print:bg-emerald-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">2. Neutrum (Neuter)</span>
                    <span className="text-xs bg-white/20 border border-white/20 px-2 py-0.5 rounded-full font-bold">
                      das
                    </span>
                  </div>
                  <span className="text-xs font-black tracking-widest">
                    {neuterList.length} WORDS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                  {neuterList.map(w => (
                    <div 
                      key={w.id} 
                      className="group flex flex-col justify-between bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 p-4 rounded-xl transition-all relative overflow-hidden h-[95px] cursor-pointer"
                      onClick={() => handleSpeak(w)}
                    >
                      <div className="absolute right-2 top-2 opacity-10 group-hover:opacity-30 transition-opacity">
                        {w.iconName && <RenderWordIcon name={w.iconName} className="text-emerald-900" />}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">das</span>
                        <span className="text-lg font-black text-emerald-900 leading-tight">{w.noun}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-100/40">
                        <span className="text-xs font-medium text-slate-500">{w.translation}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            className={`p-1 rounded-lg text-emerald-600 bg-white shadow-sm border border-emerald-200 transition-all ${
                              speakingWordId === w.id ? 'animate-bounce text-emerald-600' : 'hover:scale-105'
                            }`}
                            title="Speak Pronunciation"
                          >
                            <Volume2 size={12} />
                          </button>
                          {w.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWord(w.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors bg-white shadow-sm border border-slate-200"
                              title="Delete Word"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div 
                    onClick={() => setShowAddForm(true)}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/20 text-emerald-400 p-4 rounded-xl transition-all cursor-pointer h-[95px] print:hidden"
                  >
                    <Plus size={18} className="mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Add Neuter Noun</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. FEMININE (die) BLOCK - RED BACKGROUND */}
            {feminineList.length > 0 && (
              <div className="vocab-section animate-in fade-in duration-300">
                <div className="bg-red-600 text-white p-4 rounded-2xl flex items-center justify-between mb-4 shadow-sm print:bg-red-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">3. Feminin (Feminine)</span>
                    <span className="text-xs bg-white/20 border border-white/20 px-2 py-0.5 rounded-full font-bold">
                      die
                    </span>
                  </div>
                  <span className="text-xs font-black tracking-widest">
                    {feminineList.length} WORDS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                  {feminineList.map(w => (
                    <div 
                      key={w.id} 
                      className="group flex flex-col justify-between bg-red-50/50 hover:bg-red-50 border border-red-100 p-4 rounded-xl transition-all relative overflow-hidden h-[95px] cursor-pointer"
                      onClick={() => handleSpeak(w)}
                    >
                      <div className="absolute right-2 top-2 opacity-10 group-hover:opacity-30 transition-opacity">
                        {w.iconName && <RenderWordIcon name={w.iconName} className="text-red-900" />}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-red-500 uppercase tracking-wider">die</span>
                        <span className="text-lg font-black text-red-900 leading-tight">{w.noun}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-red-100/40">
                        <span className="text-xs font-medium text-slate-500">{w.translation}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            className={`p-1 rounded-lg text-red-600 bg-white shadow-sm border border-red-200 transition-all ${
                              speakingWordId === w.id ? 'animate-bounce text-emerald-600' : 'hover:scale-105'
                            }`}
                            title="Speak Pronunciation"
                          >
                            <Volume2 size={12} />
                          </button>
                          {w.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWord(w.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors bg-white shadow-sm border border-slate-200"
                              title="Delete Word"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div 
                    onClick={() => setShowAddForm(true)}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-red-200 hover:border-red-400 bg-white hover:bg-red-50/20 text-red-400 p-4 rounded-xl transition-all cursor-pointer h-[95px] print:hidden"
                  >
                    <Plus size={18} className="mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Add Feminine Noun</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PLURAL BLOCK - BLACK BACKGROUND WRITTEN WITH WHITE TEXT */}
            {pluralList.length > 0 && (
              <div className="vocab-section animate-in fade-in duration-300">
                <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between mb-4 shadow-sm print:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">4. Plural (Plural Nouns)</span>
                    <span className="text-xs bg-white/20 border border-white/20 px-2 py-0.5 rounded-full font-bold">
                      die
                    </span>
                  </div>
                  <span className="text-xs font-black tracking-widest text-slate-300">
                    {pluralList.length} PLURALS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                  {pluralList.map(w => (
                    <div 
                      key={w.id} 
                      className="group flex flex-col justify-between bg-slate-950 text-white hover:bg-slate-900 border border-slate-800 p-4 rounded-xl transition-all relative overflow-hidden h-[95px] cursor-pointer shadow-md"
                      onClick={() => handleSpeak(w)}
                    >
                      <div className="absolute right-2 top-2 opacity-10 group-hover:opacity-30 transition-opacity">
                        {w.iconName && <RenderWordIcon name={w.iconName} className="text-white" />}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">die</span>
                        <span className="text-lg font-black text-white leading-tight">{w.noun}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
                        <span className="text-xs font-medium text-slate-400">{w.translation}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            className={`p-1 rounded-lg text-slate-800 bg-white hover:bg-slate-100 shadow-sm border border-slate-300 transition-all ${
                              speakingWordId === w.id ? 'animate-bounce text-emerald-600' : 'hover:scale-105'
                            }`}
                            title="Speak Pronunciation"
                          >
                            <Volume2 size={12} />
                          </button>
                          {w.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWord(w.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-400 transition-colors bg-slate-900 shadow-sm border border-slate-800"
                              title="Delete Word"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div 
                    onClick={() => setShowAddForm(true)}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 hover:border-slate-400 bg-slate-900 hover:bg-slate-800 text-slate-400 p-4 rounded-xl transition-all cursor-pointer h-[95px] print:hidden"
                  >
                    <Plus size={18} className="mb-1 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Add Plural Noun</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Poster Footer decoration */}
        <div className="border-t-2 border-slate-100 pt-6 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 print:pt-4 print:mt-8">
          <p className="text-[10px] font-medium text-slate-400 text-center md:text-left leading-relaxed">
            Designed for German A1 beginner certifications (Goethe, telc, ÖSD). Color encoding references: <span className="text-blue-500 font-bold">der (Masculine)</span>, <span className="text-emerald-600 font-bold">das (Neuter)</span>, <span className="text-red-500 font-bold">die (Feminine)</span>, and <span className="text-slate-900 font-bold">die (Plural)</span>. Spacing provided for student handwriting & annotations.
          </p>
          <div className="flex gap-4 print:hidden">
            <button
              onClick={handleResetToDefault}
              className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={12} />
              Restore Defaults
            </button>
          </div>
        </div>

      </div>
      
    </div>
  );
};
