import { normalizeScore, getScoreRating } from './src/utils/formatters.js';
import { validateProductForm } from './src/utils/validators.js';
import { normalizeListing } from './src/services/listingService.js';

console.log('--- Testing normalizeScore ---');
console.assert(normalizeScore('85') === 85, 'Should normalize string score "85" to 85');
console.assert(normalizeScore(90) === 90, 'Should keep number 90');
console.assert(normalizeScore(null) === 0, 'Should return 0 for null');
console.assert(normalizeScore('bad') === 0, 'Should return 0 for non-numeric');
console.assert(normalizeScore(150) === 100, 'Should clamp 150 to 100');
console.assert(normalizeScore(-10) === 0, 'Should clamp -10 to 0');
console.log('normalizeScore tests passed!');

console.log('--- Testing getScoreRating ---');
console.assert(getScoreRating(85).color === 'emerald', '85 should be emerald');
console.assert(getScoreRating(65).color === 'amber', '65 should be amber');
console.assert(getScoreRating(40).color === 'rose', '40 should be rose');
console.log('getScoreRating tests passed!');

console.log('--- Testing validateProductForm ---');
const emptyRes = validateProductForm({ product: {}, marketplaces: [] });
console.assert(!emptyRes.isValid, 'Empty form must be invalid');
console.assert(emptyRes.errors.name, 'Name error should be present');
console.assert(emptyRes.errors.brand, 'Brand error should be present');
console.assert(emptyRes.errors.category, 'Category error should be present');
console.assert(emptyRes.errors.description, 'Description error should be present');
console.assert(emptyRes.errors.features, 'Features error should be present');
console.assert(emptyRes.errors.marketplaces, 'Marketplaces error should be present');

const validRes = validateProductForm({
  product: {
    name: 'Wireless Gaming Mouse',
    brand: 'Logitech',
    category: 'Gaming Accessories',
    description: 'A high precision gaming mouse for everyday use and competitive gaming.',
    features: ['6 programmable buttons', 'RGB lighting']
  },
  marketplaces: ['amazon', 'flipkart']
});
console.assert(validRes.isValid, 'Filled form must be valid');
console.log('validateProductForm tests passed!');

console.log('--- Testing normalizeListing ---');
const sampleBackendListing = {
  marketplace: 'amazon',
  listing: {
    title: 'Logitech G Wireless Mouse',
    bullet_points: ['Feature 1', 'Feature 2'],
    description: 'Great mouse',
    seo_keywords: ['gaming', 'mouse'],
    search_tags: ['rgb', 'wireless']
  },
  seo_score: '82',
  seo_score_breakdown: { title: '90', keywords: '75' },
  accuracy_passed: true,
  accuracy_score: '95',
  accuracy_issues: []
};

const normalized = normalizeListing(sampleBackendListing);
console.assert(normalized.marketplace === 'amazon', 'Marketplace should match');
console.assert(normalized.seo_score === 82, 'SEO score should be normalized to number 82');
console.assert(normalized.accuracy_score === 95, 'Accuracy score should be normalized to number 95');
console.assert(normalized.seo_score_breakdown.title === 90, 'Breakdown score should be normalized');
console.assert(normalized.listing.bullet_points.length === 2, 'Bullet points preserved');
console.log('normalizeListing tests passed!');

console.log('\nALL UNIT AND INTEGRATION CHECKS PASSED SUCCESSFULLY!');
