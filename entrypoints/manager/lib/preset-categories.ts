import type { TagCategory } from '../types';

export const presetCategories: TagCategory[] = [
  {
    id: 'preset-tech',
    name: 'Technology',
    keywords: [
      'github', 'stackoverflow', 'dev', 'code', 'programming', 'api',
      'docker', 'npm', 'python', 'javascript', 'typescript', 'rust',
      'react', 'vue', 'angular', 'node', 'webpack', 'vite',
      'linux', 'database', 'sql', 'aws', 'azure', 'cloud',
      'algorithm', 'leetcode', 'hackerrank', 'gitlab', 'bitbucket',
    ],
    color: '#1677ff',
    icon: 'CodeOutlined',
    isPreset: true,
  },
  {
    id: 'preset-shopping',
    name: 'Shopping',
    keywords: [
      'amazon', 'ebay', 'shop', 'cart', 'buy', 'price', 'deal',
      'etsy', 'walmart', 'target', 'aliexpress', 'taobao', 'jd.com',
      'tmall', 'pinduoduo', 'store', 'order', 'product',
    ],
    color: '#f5222d',
    icon: 'ShoppingOutlined',
    isPreset: true,
  },
  {
    id: 'preset-news',
    name: 'News',
    keywords: [
      'news', 'article', 'bbc', 'cnn', 'reuters', 'headline',
      'press', 'media', 'journal', 'report', 'breaking',
      'nytimes', 'guardian', 'washingtonpost', 'xinhua', 'sina',
    ],
    color: '#fa8c16',
    icon: 'ReadOutlined',
    isPreset: true,
  },
  {
    id: 'preset-social',
    name: 'Social',
    keywords: [
      'twitter', 'reddit', 'facebook', 'instagram', 'linkedin',
      'mastodon', 'discord', 'telegram', 'whatsapp', 'wechat',
      'weibo', 'douban', 'zhihu', 'quora', 'threads', 'bluesky',
    ],
    color: '#722ed1',
    icon: 'TeamOutlined',
    isPreset: true,
  },
  {
    id: 'preset-video',
    name: 'Video',
    keywords: [
      'youtube', 'vimeo', 'twitch', 'netflix', 'video', 'watch',
      'bilibili', 'youku', 'iqiyi', 'tiktok', 'douyin',
      'stream', 'movie', 'film', 'anime', 'hulu', 'disney',
    ],
    color: '#eb2f96',
    icon: 'PlayCircleOutlined',
    isPreset: true,
  },
  {
    id: 'preset-reference',
    name: 'Reference',
    keywords: [
      'wikipedia', 'docs', 'documentation', 'tutorial', 'guide',
      'wiki', 'manual', 'reference', 'handbook', 'mdn',
      'w3schools', 'learn', 'course', 'education', 'academy',
    ],
    color: '#13c2c2',
    icon: 'BookOutlined',
    isPreset: true,
  },
  {
    id: 'preset-finance',
    name: 'Finance',
    keywords: [
      'bank', 'finance', 'stock', 'invest', 'crypto', 'trading',
      'market', 'fund', 'insurance', 'loan', 'mortgage',
      'paypal', 'stripe', 'wallet', 'exchange', 'binance',
    ],
    color: '#52c41a',
    icon: 'DollarOutlined',
    isPreset: true,
  },
];
