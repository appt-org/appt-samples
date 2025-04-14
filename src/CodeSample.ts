import { 
  CodeBlock, 
  CodeSampleOptions, 
  CodeSampleResult, 
  CodeBlocksFetcher, 
  PlatformLabel 
} from './types';

/**
 * Default platform labels
 */
const DEFAULT_PLATFORM_LABELS: PlatformLabel[] = [
  { id: 'android', label: 'Android' },
  { id: 'jetpack-compose', label: 'Jetpack Compose' },
  { id: 'ios', label: 'iOS' },
  { id: 'swiftui', label: 'SwiftUI' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'react-native', label: 'React Native' },
  { id: 'net-maui', label: '.NET MAUI' },
  { id: 'xamarin', label: 'Xamarin' },
];

/**
 * Default platforms to show
 */
const DEFAULT_PLATFORMS = [
  'android',
  'jetpack-compose',
  'ios',
  'swiftui',
  'flutter',
  'react-native',
  'net-maui',
  'xamarin',
];

/**
 * Core CodeSample class for handling code samples
 * Pure TypeScript implementation with no UI dependencies
 */
export class CodeSample {
  private readonly id: string;
  private readonly platform?: string;
  private readonly locale: string;
  private readonly defaultPlatforms: string[];
  private readonly platformLabels: PlatformLabel[];
  private readonly fetchCodeBlocks: CodeBlocksFetcher;

  /**
   * Create a new CodeSample instance
   * 
   * @param options Configuration options
   * @param fetchCodeBlocks Function to fetch code blocks
   */
  constructor(
    options: CodeSampleOptions,
    fetchCodeBlocks: CodeBlocksFetcher
  ) {
    this.id = options.id;
    this.platform = options.platform;
    this.locale = options.locale || 'en';
    this.defaultPlatforms = options.defaultPlatforms || DEFAULT_PLATFORMS;
    this.platformLabels = options.platformLabels || DEFAULT_PLATFORM_LABELS;
    this.fetchCodeBlocks = fetchCodeBlocks;
  }

  /**
   * Get label for a platform ID
   */
  private getPlatformLabel(platformId: string): string {
    const platform = this.platformLabels.find(p => p.id === platformId);
    return platform ? platform.label : platformId;
  }

  /**
   * Get platforms to display
   */
  private getPlatformsToShow(): string[] {
    return this.platform ? [this.platform] : this.defaultPlatforms;
  }

  /**
   * Load code samples based on the configuration
   * @returns Promise resolving to a CodeSampleResult
   */
  async load(): Promise<CodeSampleResult> {
    const platforms = this.getPlatformsToShow();
    
    try {
      const codeBlocks = await this.fetchCodeBlocks(this.id, platforms, this.locale);
      
      // Filter out any null blocks and ensure labels are set
      const validCodeBlocks: CodeBlock[] = codeBlocks
        .filter((block): block is CodeBlock => !!block)
        .map(block => ({
          ...block,
          // Use platform label from config if not provided
          label: block.label || this.getPlatformLabel(block.platform)
        }));
      
      return {
        id: this.id,
        codeBlocks: validCodeBlocks
      };
    } catch (error) {
      console.error(`Failed to load code samples for ${this.id}:`, error);
      return {
        id: this.id,
        codeBlocks: []
      };
    }
  }
}