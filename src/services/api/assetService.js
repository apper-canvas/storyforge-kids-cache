const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AssetService {
  constructor() {
    // Cache for loaded assets
    this.assetsCache = {
      characters: null,
      backgrounds: null,
      props: null
    };
  }

  async getCharacters(theme = null) {
    await delay(200);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'theme', 'image_url', 'animations'],
        where: theme ? [
          {
            FieldName: 'theme',
            Operator: 'ExactMatch',
            Values: [theme]
          }
        ] : []
      };

      const response = await apperClient.fetchRecords('character', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data.map(char => ({
        id: char.Id.toString(),
        name: char.Name,
        theme: char.theme,
        imageUrl: char.image_url,
        animations: char.animations ? char.animations.split(',') : ['walk', 'jump', 'wave'],
        type: 'character'
      }));
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }

  async getBackgrounds(theme = null) {
    await delay(200);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'theme', 'image_url'],
        where: theme ? [
          {
            FieldName: 'theme',
            Operator: 'ExactMatch',
            Values: [theme]
          }
        ] : []
      };

      const response = await apperClient.fetchRecords('background', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data.map(bg => ({
        id: bg.Id.toString(),
        name: bg.Name,
        theme: bg.theme,
        imageUrl: bg.image_url,
        type: 'background'
      }));
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      throw error;
    }
  }

  async getProps(theme = null) {
    await delay(200);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'theme', 'image_url', 'animations'],
        where: theme ? [
          {
            FieldName: 'theme',
            Operator: 'ExactMatch',
            Values: [theme]
          }
        ] : []
      };

      const response = await apperClient.fetchRecords('prop', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data.map(prop => ({
        id: prop.Id.toString(),
        name: prop.Name,
        theme: prop.theme,
        imageUrl: prop.image_url,
        animations: prop.animations ? prop.animations.split(',') : ['sparkle'],
        type: 'prop'
      }));
    } catch (error) {
      console.error('Error fetching props:', error);
      throw error;
    }
  }

  async getAllAssets(theme = null) {
    await delay(300);
    const [characters, backgrounds, props] = await Promise.all([
      this.getCharacters(theme),
      this.getBackgrounds(theme),
      this.getProps(theme)
    ]);
    
    return {
      characters,
      backgrounds,
      props
    };
  }

  async getAssetById(id, type) {
    await delay(150);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      let tableName;
      let fields = ['Name', 'theme', 'image_url'];
      
      switch (type) {
        case 'character':
          tableName = 'character';
          fields.push('animations');
          break;
        case 'background':
          tableName = 'background';
          break;
        case 'prop':
          tableName = 'prop';
          fields.push('animations');
          break;
        default:
          throw new Error('Invalid asset type');
      }

      const params = { fields };
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      const asset = response.data;
      return {
        id: asset.Id.toString(),
        name: asset.Name,
        theme: asset.theme,
        imageUrl: asset.image_url,
        animations: asset.animations ? asset.animations.split(',') : [],
        type: type
      };
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }
  }

  getAvailableThemes() {
    return ['fantasy', 'space', 'underwater'];
  }

  getAnimationsForCharacter(characterId) {
    // This would need to be fetched from database in real implementation
    return ['walk', 'jump', 'wave'];
  }
}

export default new AssetService();