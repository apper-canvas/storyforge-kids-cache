import charactersData from '../mockData/characters.json';
import backgroundsData from '../mockData/backgrounds.json';
import propsData from '../mockData/props.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AssetService {
  constructor() {
    this.characters = [...charactersData];
    this.backgrounds = [...backgroundsData];
    this.props = [...propsData];
  }

  async getCharacters(theme = null) {
    await delay(200);
    if (theme) {
      return this.characters.filter(char => char.theme === theme);
    }
    return [...this.characters];
  }

  async getBackgrounds(theme = null) {
    await delay(200);
    if (theme) {
      return this.backgrounds.filter(bg => bg.theme === theme);
    }
    return [...this.backgrounds];
  }

  async getProps(theme = null) {
    await delay(200);
    if (theme) {
      return this.props.filter(prop => prop.theme === theme);
    }
    return [...this.props];
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
    let assets = [];
    
    switch (type) {
      case 'character':
        assets = this.characters;
        break;
      case 'background':
        assets = this.backgrounds;
        break;
      case 'prop':
        assets = this.props;
        break;
      default:
        throw new Error('Invalid asset type');
    }
    
    const asset = assets.find(a => a.id === id);
    if (!asset) {
      throw new Error('Asset not found');
    }
    
    return { ...asset };
  }

  getAvailableThemes() {
    const themes = new Set();
    [...this.characters, ...this.backgrounds, ...this.props].forEach(asset => {
      themes.add(asset.theme);
    });
    return Array.from(themes);
  }

  getAnimationsForCharacter(characterId) {
    const character = this.characters.find(c => c.id === characterId);
    return character ? character.animations : [];
  }
}

export default new AssetService();