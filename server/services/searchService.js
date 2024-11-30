import { QuranService } from './quranService.js';

export class SearchService {
  static async search(query) {
    try {
      // Search in Quran verses
      const verses = await QuranService.searchVerses(query);
      
      if (verses.length === 0) {
        return {
          answer: "I couldn't find a relevant answer in the available resources.",
          references: []
        };
      }
      
      // Format the response with both Arabic and translation
      const mainVerse = verses[0];
      const answer = `${mainVerse.arabic}\n\nTranslation: ${mainVerse.text}`;
      
      return {
        answer,
        references: verses.map(v => ({
          resourceId: v.reference.resourceId,
          metadata: v.reference.metadata
        }))
      };
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error('Failed to perform search');
    }
  }
}