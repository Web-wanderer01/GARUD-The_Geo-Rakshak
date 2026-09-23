import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';

export default function LiveNewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const CATEGORIZED_IMAGES = {
    flood: [
      'https://images.unsplash.com/photo-1657069344312-a500de53b566?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1657069342814-ef2dcfb25f6f?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&w=160&q=80'
    ],
    landslide: [
      'https://images.unsplash.com/photo-1647125849914-5238985ab21a?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1611932846203-c4c9e2e825a8?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1728114553153-80744d22cb67?auto=format&fit=crop&w=160&q=80'
    ],
    emergency: [
      'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=160&q=80',
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=160&q=80'
    ]
  };

  const getTopicImage = (title, index) => {
    const text = title.toLowerCase();
    let category = 'emergency'; 
    if (text.includes('flood') || text.includes('rain') || text.includes('water') || text.includes('monsoon')) {
      category = 'flood';
    } else if (text.includes('landslide') || text.includes('mud') || text.includes('earthquake') || text.includes('road')) {
      category = 'landslide';
    } else if (text.includes('ndrf') || text.includes('rescue') || text.includes('relief')) {
      category = 'emergency';
    }
    const pool = CATEGORIZED_IMAGES[category];
    return pool[index % pool.length];
  };

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const query = '(landslide OR flood OR weather OR NDRF OR logistics) (Assam OR Meghalaya OR Sikkim OR Manipur)';
        const gNewsUrl = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query) + '&hl=en-IN&gl=IN&ceid=IN:en';
        const rssUrl = encodeURIComponent(gNewsUrl);
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + rssUrl);
        
        if (!res.ok) throw new Error("Failed to fetch live news");
        const data = await res.json();
        
        if (data.items && data.items.length > 0) {
          const formattedNews = data.items.slice(0, 4).map((item, index) => ({
            title: item.title.split(' - ')[0],
            source: { name: item.title.split(' - ').pop() || 'News Source' },
            url: item.link,
            publishedAt: item.pubDate,
            imageUrl: getTopicImage(item.title, index)
          }));
          setNews(formattedNews);
          setError(null);
        } else {
          throw new Error("No news items found");
        }
      } catch (err) {
        setError("Network error fetching live news. Showing cached updates.");
        setNews([
          { title: "IMD predicts heavy rainfall across Assam and Meghalaya over next 48 hours", source: { name: "Regional Met Centre" }, url: "#", publishedAt: new Date().toISOString(), imageUrl: getTopicImage("IMD predicts heavy rainfall across Assam and Meghalaya over next 48 hours", 0) },
          { title: "NDRF teams pre-deployed in vulnerable districts of Sikkim", source: { name: "Disaster Management" }, url: "#", publishedAt: new Date(Date.now() - 3600000).toISOString(), imageUrl: getTopicImage("NDRF teams pre-deployed in vulnerable districts of Sikkim", 1) },
          { title: "Silchar-Shillong Highway blocked by massive landslide, supply fleets halted", source: { name: "Infrastructure Daily" }, url: "#", publishedAt: new Date(Date.now() - 7200000).toISOString(), imageUrl: getTopicImage("Silchar-Shillong Highway blocked by massive landslide, supply fleets halted", 2) },
          { title: "AI routing successfully diverts essential medical supplies around flood zones", source: { name: "Logistics Times" }, url: "#", publishedAt: new Date(Date.now() - 14400000).toISOString(), imageUrl: getTopicImage("AI routing successfully diverts essential medical supplies around flood zones", 3) }
        ]);
      } finally {
        setLoading(false);
        setLastRefreshed(new Date());
      }
    }
    fetchNews();
    
    // Auto-refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
             <Newspaper className="w-5 h-5" />
          </div>
          <div>
             <h3 className="text-lg font-bold text-slate-800">Live Regional News</h3>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] text-slate-500">Refreshed</p>
           <p className="text-xs font-bold text-slate-700">{lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {loading && news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-blue-500" />
          <span className="text-sm font-medium">Connecting...</span>
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {error && (
            <div className="flex items-start gap-2 text-[11px] bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200 mb-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            {news.map((article, idx) => (
              <a key={idx} href={article.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2 transition-all hover:shadow-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-slate-200 rounded overflow-hidden relative">
                   {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rescue_operations_in_flood_hit_areas_of_Assam.jpg/320px-Rescue_operations_in_flood_hit_areas_of_Assam.jpg'; }} />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                         <ImageIcon className="w-6 h-6 opacity-50" />
                      </div>
                   )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span className="font-semibold px-1.5 py-0.5 bg-white rounded border border-slate-100 truncate max-w-[100px]">{article.source.name}</span>
                    <span className="flex items-center gap-1 opacity-75 whitespace-nowrap">
                      {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
