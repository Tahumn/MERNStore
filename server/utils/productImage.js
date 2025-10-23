const { keywordImages, fallbackImages } = require('../constants/productImages');

const toLower = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const hashString = value => {
  const input = String(value || '');
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
};

const matchImageByKeywords = (keywordsSource = '') => {
  const source = toLower(keywordsSource);

  for (const { keywords, imageUrl } of keywordImages) {
    if (keywords.some(keyword => source.includes(keyword))) {
      return imageUrl;
    }
  }

  return null;
};

const aggregateCandidateStrings = product => {
  if (!product) {
    return '';
  }

  const parts = [];

  if (product.name) parts.push(product.name);
  if (product.slug) parts.push(product.slug);
  if (product.sku) parts.push(product.sku);

  if (product.brand) {
    if (typeof product.brand === 'string') {
      parts.push(product.brand);
    } else {
      if (product.brand.name) parts.push(product.brand.name);
      if (product.brand.slug) parts.push(product.brand.slug);
    }
  }

  if (product.category) {
    if (typeof product.category === 'string') {
      parts.push(product.category);
    } else if (product.category.name) {
      parts.push(product.category.name);
    }
  }

  return parts.join(' ');
};

const getFallbackPool = () => {
  if (fallbackImages && fallbackImages.length > 0) {
    return fallbackImages;
  }

  return keywordImages.map(item => item.imageUrl);
};

const selectProductImage = product => {
  const candidateString = aggregateCandidateStrings(product);
  const keywordMatch = matchImageByKeywords(candidateString);
  if (keywordMatch) {
    return keywordMatch;
  }

  const pool = getFallbackPool();
  const identifier =
    product?.slug ||
    product?._id?.toString?.() ||
    product?.sku ||
    product?.name ||
    candidateString ||
    `${Date.now()}`;

  const index = Math.abs(hashString(identifier)) % pool.length;
  return pool[index];
};

const cloneProduct = product => {
  if (!product) return product;
  if (typeof product.toObject === 'function') {
    return product.toObject();
  }
  return { ...product };
};

const ensureProductImage = product => {
  if (!product) return product;

  const cloned = cloneProduct(product);

  if (!cloned.imageUrl) {
    cloned.imageUrl = selectProductImage(cloned);
  }

  return cloned;
};

const ensureProductsHaveImage = products => {
  if (!Array.isArray(products)) return [];
  return products.map(item => ensureProductImage(item));
};

module.exports = {
  selectProductImage,
  ensureProductImage,
  ensureProductsHaveImage
};
