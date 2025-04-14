import { CodeSample } from '../src/CodeSample';  // Adjust path as needed
import { CodeBlocksFetcher } from '../src/types';

describe('CodeSample', () => {
  const mockFetcher: CodeBlocksFetcher = async (id, platforms) => {
    return platforms.map(platform => ({
      platform,
      label: platform.toUpperCase(),
      url: `https://example.com/${id}/${platform}`,
      content: `// ${platform} code`
    }));
  };

  it('should load code blocks for all platforms', async () => {
    const sample = new CodeSample({ id: 'test-sample' }, mockFetcher);
    const result = await sample.load();
    
    expect(result.id).toBe('test-sample');
    expect(result.codeBlocks.length).toBeGreaterThan(0);
  });

  it('should filter by platform when specified', async () => {
    const sample = new CodeSample({ 
      id: 'test-sample',
      platform: 'android'
    }, mockFetcher);
    
    const result = await sample.load();
    
    expect(result.codeBlocks.length).toBe(1);
    expect(result.codeBlocks[0].platform).toBe('android');
  });
});