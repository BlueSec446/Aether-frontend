import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Base JavaScript rules
  js.configs.recommended,

  // TypeScript rules
  ...ts.configs.recommended,

  // Svelte rules
  ...svelte.configs['flat/recommended'],

  // Prettier integration (disables ESLint rules that conflict with Prettier)
  prettier,
  ...svelte.configs['flat/prettier'],

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    // Tell ESLint how to parse inside Svelte files
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },
  {
    // Ignore build output and module folders
    ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/']
  }
];
