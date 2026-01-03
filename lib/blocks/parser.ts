/**
 * Block Parser Utilities
 *
 * Parses TypeScript source code to extract interface definitions,
 * dependencies, and other metadata from block components.
 */

import type { PropDefinition } from "@/types/block";

/**
 * Extract the props interface from a block's source code
 *
 * Looks for patterns like:
 * - export interface HeroGradientProps { ... }
 * - interface Props { ... }
 */
export function extractPropsInterface(sourceCode: string): string | undefined {
  // Match interface declarations ending with "Props"
  // Using [\s\S] instead of . with 's' flag for cross-line matching
  const interfaceRegex =
    /export\s+interface\s+(\w+Props)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
  const match = interfaceRegex.exec(sourceCode);

  if (match) {
    return match[0];
  }

  // Fallback: look for any interface ending with Props
  const simpleRegex = /interface\s+(\w+Props)\s*\{([^}]+)\}/;
  const simpleMatch = simpleRegex.exec(sourceCode);

  return simpleMatch ? simpleMatch[0] : undefined;
}

/**
 * Parse props from an interface string into structured data
 */
export function parsePropsInterface(interfaceStr: string): PropDefinition[] {
  const props: PropDefinition[] = [];

  // Extract the body between { and }
  const bodyMatch = interfaceStr.match(/\{([\s\S]*)\}/);
  if (!bodyMatch?.[1]) return props;

  const body = bodyMatch[1];

  // Split by semicolons or newlines, handling multi-line types
  const lines = body.split(/[;\n]/).filter((line) => line.trim());

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*")) {
      continue;
    }

    // Match prop definition: name?: type
    const propMatch = trimmed.match(/^(\w+)(\?)?:\s*(.+)$/);
    if (propMatch) {
      const [, name, optional, type] = propMatch;

      // Extract JSDoc comment if present (look backwards in original)
      const jsDocMatch = interfaceStr.match(
        new RegExp(`\\/\\*\\*[^*]*\\*\\/\\s*${name}`)
      );
      let description: string | undefined;
      if (jsDocMatch) {
        const descMatch = jsDocMatch[0].match(/\/\*\*\s*\*?\s*([^*]+)/);
        description = descMatch?.[1]?.trim();
      }

      // Extract default value from JSDoc @default
      const defaultMatch = interfaceStr.match(
        new RegExp(`@default\\s+([^\\n*]+)\\s*\\*?\\s*${name}`)
      );
      const defaultValue = defaultMatch?.[1]?.trim();

      if (name) {
        props.push({
          name,
          type: type?.trim() || "unknown",
          optional: optional === "?",
          description,
          defaultValue,
        });
      }
    }
  }

  return props;
}

/**
 * Extract npm dependencies from import statements
 *
 * Ignores:
 * - Relative imports (./something, ../something)
 * - Alias imports (@/something)
 * - React (assumed to be present)
 */
export function extractDependencies(sourceCode: string): string[] {
  const dependencies = new Set<string>();

  // Match import statements
  const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;

  let match;
  while ((match = importRegex.exec(sourceCode)) !== null) {
    const importPath = match[1];

    // Skip relative imports
    if (importPath?.startsWith(".") || importPath?.startsWith("@/")) {
      continue;
    }

    // Skip React (always available)
    if (importPath === "react") {
      continue;
    }

    // Extract package name (handle scoped packages like @radix-ui/react-*)
    if (importPath) {
      if (importPath.startsWith("@")) {
        // Scoped package: @scope/package or @scope/package/subpath
        const parts = importPath.split("/");
        if (parts.length >= 2) {
          dependencies.add(`${parts[0]}/${parts[1]}`);
        }
      } else {
        // Regular package: package or package/subpath
        const packageName = importPath.split("/")[0];
        if (packageName) {
          dependencies.add(packageName);
        }
      }
    }
  }

  return Array.from(dependencies).sort();
}

/**
 * Extract the component name from source code
 *
 * Looks for:
 * - export function ComponentName
 * - export const ComponentName
 * - export default ComponentName
 */
export function extractComponentName(sourceCode: string): string | undefined {
  // Named function export
  const funcMatch = sourceCode.match(/export\s+function\s+(\w+)/);
  if (funcMatch) return funcMatch[1];

  // Named const export (arrow function)
  const constMatch = sourceCode.match(/export\s+const\s+(\w+)\s*=/);
  if (constMatch) return constMatch[1];

  // Default export with name
  const defaultMatch = sourceCode.match(/export\s+default\s+(\w+)/);
  if (defaultMatch && !defaultMatch[1]?.match(/function|class/)) {
    return defaultMatch[1];
  }

  return undefined;
}

/**
 * Check if source code contains "use client" directive
 */
export function isClientComponent(sourceCode: string): boolean {
  return sourceCode.trimStart().startsWith('"use client"') ||
    sourceCode.trimStart().startsWith("'use client'");
}

/**
 * Extract the description from JSDoc comment at the top of the file
 */
export function extractDescription(sourceCode: string): string | undefined {
  // Look for JSDoc comment at the start (after "use client" if present)
  const jsDocMatch = sourceCode.match(
    /(?:['"]use client['"];\s*)?\/\*\*\s*\n\s*\*\s*([^\n@*]+)/
  );
  return jsDocMatch?.[1]?.trim();
}

/**
 * Extract all metadata from a block's source code
 */
export function parseBlockSource(sourceCode: string): {
  componentName?: string;
  propsInterface?: string;
  props: PropDefinition[];
  dependencies: string[];
  isClient: boolean;
  description?: string;
} {
  const propsInterface = extractPropsInterface(sourceCode);

  return {
    componentName: extractComponentName(sourceCode),
    propsInterface,
    props: propsInterface ? parsePropsInterface(propsInterface) : [],
    dependencies: extractDependencies(sourceCode),
    isClient: isClientComponent(sourceCode),
    description: extractDescription(sourceCode),
  };
}
