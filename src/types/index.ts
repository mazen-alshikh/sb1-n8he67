export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Resource {
  id: string;
  title: string;
  type: 'quran' | 'hadith';
  content: string;
  metadata: {
    chapter?: number;
    verse?: number;
    book?: string;
    page?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  answer?: string;
  references?: {
    resourceId: string;
    metadata: Resource['metadata'];
  }[];
  createdAt: Date;
}