const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StoryService {
  constructor() {
    this.currentStoryId = null;
  }

  async getAll() {
    await delay(300);
    
    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'title', 'theme', 'created_at', 'updated_at', 'CreatedOn', 'ModifiedOn'],
        orderBy: [
          {
            FieldName: 'ModifiedOn',
            SortType: 'DESC'
          }
        ]
      };

      const response = await apperClient.fetchRecords('story', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      // Transform database response to match expected format
      return response.data.map(story => ({
        id: story.Id.toString(),
        title: story.title || story.Name || 'Untitled Story',
        theme: story.theme || 'fantasy',
        scenes: [], // Scenes would be loaded separately
        createdAt: story.created_at || story.CreatedOn,
        updatedAt: story.updated_at || story.ModifiedOn
      }));
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'title', 'theme', 'created_at', 'updated_at']
      };

      const response = await apperClient.getRecordById('story', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      // Transform database response
      const story = response.data;
      return {
        id: story.Id.toString(),
        title: story.title || story.Name || 'Untitled Story',
        theme: story.theme || 'fantasy',
        scenes: [], // Would load scenes separately
        createdAt: story.created_at || story.CreatedOn,
        updatedAt: story.updated_at || story.ModifiedOn
      };
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  }

  async create(storyData) {
    await delay(400);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: storyData.title || 'New Story',
          title: storyData.title || 'New Story',
          theme: storyData.theme || 'fantasy',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('story', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      const successfulRecords = response.results.filter(result => result.success);
      if (successfulRecords.length === 0) {
        throw new Error('Failed to create story');
      }

      const createdStory = successfulRecords[0].data;
      return {
        id: createdStory.Id.toString(),
        title: createdStory.title || createdStory.Name,
        theme: createdStory.theme,
        scenes: storyData.scenes || [],
        createdAt: createdStory.created_at,
        updatedAt: createdStory.updated_at
      };
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }

  async update(id, updates) {
    await delay(350);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          title: updates.title,
          theme: updates.theme,
          updated_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('story', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      const successfulUpdates = response.results.filter(result => result.success);
      if (successfulUpdates.length === 0) {
        throw new Error('Failed to update story');
      }

      const updatedStory = successfulUpdates[0].data;
      return {
        id: updatedStory.Id.toString(),
        title: updatedStory.title,
        theme: updatedStory.theme,
        scenes: updates.scenes || [],
        createdAt: updatedStory.created_at,
        updatedAt: updatedStory.updated_at
      };
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  }

  async delete(id) {
    await delay(250);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('story', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }

  async duplicate(id) {
    await delay(400);
    
    try {
      // First get the original story
      const original = await this.getById(id);
      
      // Create a duplicate
      const duplicated = await this.create({
        title: `${original.title} (Copy)`,
        theme: original.theme,
        scenes: original.scenes
      });
      
      return duplicated;
    } catch (error) {
      console.error('Error duplicating story:', error);
      throw error;
    }
  }

  setCurrentStory(storyId) {
    this.currentStoryId = storyId;
  }

  getCurrentStoryId() {
    return this.currentStoryId;
  }
}

export default new StoryService();