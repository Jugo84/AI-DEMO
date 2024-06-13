import { get_encoding } from 'tiktoken';

export function countTokens(text: string) {
  try {
    const encoding = get_encoding('cl100k_base');
    const tokens = encoding.encode(text);
    return tokens.length;
  } catch (error) {
    console.error('Error counting tokens:', error);
    return -1;
  }
}
