import storiesData from '../mockData/stories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StoryService {
  constructor() {
    this.stories = [...storiesData];
    this.currentStoryId = null;
  }

  async getAll() {
    await delay(300);
    return [...this.stories];
  }

  async getById(id) {
    await delay(200);
    const story = this.stories.find(s => s.id === id);
    if (!story) {
      throw new Error('Story not found');
    }
    return { ...story };
  }

  async create(storyData) {
    await delay(400);
    const newStory = {
      id: Date.now().toString(),
      title: storyData.title || 'New Story',
      theme: storyData.theme || 'adventure',
      scenes: storyData.scenes || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.stories.push(newStory);
    return { ...newStory };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.stories.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Story not found');
    }
    
    this.stories[index] = {
      ...this.stories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.stories[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.stories.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Story not found');
    }
    
    this.stories.splice(index, 1);
    return { success: true };
  }

  async duplicate(id) {
    await delay(400);
    const original = await this.getById(id);
    const duplicated = {
      ...original,
      id: Date.now().toString(),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.stories.push(duplicated);
    return { ...duplicated };
  }

  setCurrentStory(storyId) {
    this.currentStoryId = storyId;
  }

  getCurrentStoryId() {
    return this.currentStoryId;
  }
}

export default new StoryService();