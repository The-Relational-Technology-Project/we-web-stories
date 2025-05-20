
export interface Story {
  id: string;
  title: string;
  description: string;
  likes: number;
  category: 'learning' | 'community' | 'collaboration' | 'discovery' | 'creativity' | 'abundance' | 'care' | 'ai';
  hasLiked?: boolean;
}

export const stories: Story[] = [
  {
    id: '1',
    title: 'Networked Abundance',
    description: "I have a dream of a local grocery co-op... As it turns out, so do 1,000 other people. And, they have a ton of resources and skills! A community of action forms to bring our shared dream to life.",
    likes: 48,
    category: 'abundance'
  },
  {
    id: '2',
    title: "Prosocial 'Care to Comment'",
    description: "Before you comment... Are your needs met? → get support now. Are the commenters' needs met? → organize to support them. Still want to post? get a reminder from your self-reflections.",
    likes: 37,
    category: 'care'
  },
  {
    id: '3',
    title: "'Operation Pronoia', aka True Community AI",
    description: "Networks of communities equipped with... Open-source LLMs, community-governed knowledge bases, community deliberation for the community AI's goals. Enables hyperlocal and internet-wide connections. Sneaking suspicion that the social universe is conspiring in your favor.",
    likes: 52,
    category: 'ai'
  },
  {
    id: '8',
    title: "Humans and Non-Humans",
    description: "In our neighborhood network, trees and plants and pets and wild animals all have names and profiles and backstories – and participate in our mutual aid network, sharing their needs and offers and aspirations (human-translated) with humans.",
    likes: 50,
    category: 'community'
  },
  {
    id: '4',
    title: 'Prosocial AI',
    description: "You upload some family financials to an AI chat and get some great suggested actions. Even better, you get offers to connect with five other families facing surprisingly similar situations, and one who navigated all of this successfully over the past year!",
    likes: 41,
    category: 'ai'
  },
  {
    id: '5',
    title: 'Prosocial Wikipedia',
    description: "You're reading about planting onion seeds and then get invited to connect with 3 people in your neighborhood who were reading that same article this week.",
    likes: 42,
    category: 'learning'
  },
  {
    id: '6',
    title: 'Neighborhood Skill Exchange',
    description: "As you watch a DIY home repair video, you're connected with a retired contractor two blocks away who's available this weekend to help guide you through the process.",
    likes: 37,
    category: 'community'
  },
  {
    id: '7',
    title: 'Relational Rideshare',
    description: "Recognizing that car journeys are an ideal place for a real conversation, matched riders and drivers in our community equip one another with conversation-starting questions to ask!",
    likes: 45,
    category: 'community'
  }
];
