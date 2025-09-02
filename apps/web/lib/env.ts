export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  SERPER_API_KEY: process.env.SERPER_API_KEY || '',
  LANGSMITH_API_KEY: process.env.LANGSMITH_API_KEY || '',
  LANGSMITH_PROJECT: process.env.LANGSMITH_PROJECT || '',
  ALLOWED_SHOPS: (process.env.ALLOWED_SHOPS || '').split(',').filter(Boolean)
};
