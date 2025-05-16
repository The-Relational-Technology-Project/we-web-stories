
export interface Story {
  id: string;
  title: string;
  description: string;
  likes: number;
  category: 'learning' | 'community' | 'collaboration' | 'discovery' | 'creativity';
  hasLiked?: boolean;
}

export const stories: Story[] = [
  {
    id: '1',
    title: 'Prosocial Wikipedia',
    description: "You're reading about planting onion seeds and then get invited to connect with 3 people in your neighborhood who were reading that same article this week.",
    likes: 42,
    category: 'learning'
  },
  {
    id: '2',
    title: 'Neighborhood Skill Exchange',
    description: "As you watch a DIY home repair video, you're connected with a retired contractor two blocks away who's available this weekend to help guide you through the process.",
    likes: 37,
    category: 'community'
  },
  {
    id: '3',
    title: 'Collaborative Research Network',
    description: "While researching climate solutions, you discover a group of citizen scientists in your region collecting relevant data, and you're invited to join their next field expedition.",
    likes: 29,
    category: 'collaboration'
  },
  {
    id: '4',
    title: 'Serendipitous Book Club',
    description: "Your e-reader notices you've highlighted similar passages as others nearby and suggests a pop-up discussion group at a local café this weekend.",
    likes: 51,
    category: 'discovery'
  },
  {
    id: '5',
    title: 'Community Memory Archive',
    description: "While researching your town's history, you receive gentle prompts to contribute your family's stories and photos to the community's living digital archive.",
    likes: 33,
    category: 'creativity'
  },
  {
    id: '6',
    title: 'Farmers Market Matchmaking',
    description: "Your meal planning app connects you with a local farmer who's harvesting exactly what you need this week, offering a direct purchase with pickup at tomorrow's market.",
    likes: 45,
    category: 'community'
  }
];
