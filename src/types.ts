/**
 * Represents a single code block for a specific platform
 */
export interface CodeBlock {
  /** Platform identifier (e.g., 'android', 'ios') */
  platform: string;
  
  /** Display label for the platform (e.g., 'Android', 'iOS') */
  label: string;
  
  /** URL to the source of the code */
  url: string;
  
  /** Code content as a string */
  content: string;
}

/**
 * Platform label mapping
 */
export interface PlatformLabel {
  /** Platform identifier */
  id: string;
  
  /** Display label */
  label: string;
}

/**
 * Configuration options for the CodeSample
 */
export interface CodeSampleOptions {
  /** Unique identifier for the code sample */
  id: string;
  
  /** Optional single platform to display (filters results) */
  platform?: string;
  
  /** Locale for the code samples */
  locale?: string;
  
  /** Default platforms to show when no specific platform is provided */
  defaultPlatforms?: string[];
  
  /** Label mappings for platforms */
  platformLabels?: PlatformLabel[];
}

/**
 * Result of loading code samples
 */
export interface CodeSampleResult {
  /** Identifier that was used to load these samples */
  id: string;
  
  /** The loaded code blocks */
  codeBlocks: CodeBlock[];
}

/**
 * Function type for fetching code blocks
 */
export type CodeBlocksFetcher = (
  id: string, 
  platforms: string[], 
  locale?: string
) => Promise<CodeBlock[]>;