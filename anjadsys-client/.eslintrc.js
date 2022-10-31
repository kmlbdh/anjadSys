module.exports = {
  "root": true,
  "ignorePatterns": [
    "projects/**/*"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.json"
        ],
        "sourceType": "module",
        "tsconfigRootDir": __dirname,
        "createDefaultProgram": true
      },
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ],
        "semi": ["error", "always"],
        "quotes": ["error", "single", {
          "avoidEscape": true,
          "allowTemplateLiterals": true
        }],
        "indent": [ "error", 2 ],
        "linebreak-style": ["error", "unix" ],
        "array-bracket-spacing": ["error", "always", {
          "singleValue": false,
          "objectsInArrays": true,
          "arraysInArrays": true
        }],
        "template-curly-spacing": ["error", "always"],
        "switch-colon-spacing": ["error", {"after": true, "before": false}],
        "space-unary-ops": ["error",  {"words": true, "nonwords": false}],
        "space-before-function-paren": ["error", {
          "anonymous": "always",
          "named": "never",
          "asyncArrow": "always"
        }],
        "space-before-blocks": ["error", {
          "functions": "always",
          "keywords": "always",
          "classes": "always"
        }],
        "padded-blocks": ["error", {
          "blocks": "never",
          "classes": "always",
          "switches": "never"
        }, { "allowSingleLineBlocks": true }],
        "object-curly-spacing": ["error", "always"],
        "max-statements-per-line": ["error", { "max": 2 }],
        "keyword-spacing":  ["error", {
          "before": true,
          "after": true
        }],
        "func-call-spacing": ["error", "never"],
        "dot-location": ["error", "property"],
        "comma-style": ["error", "last"],
        "comma-spacing": ["error", {
          "before": false,
          "after": true
        }],
        "block-spacing": ["error", "always"],
        "arrow-spacing": ["error", { "before": true, "after": true }],
        "arrow-parens": ["error", "as-needed"],
        "arrow-body-style": ["error", "as-needed"],
        "no-trailing-spaces": ["error"],
        "no-whitespace-before-property": ["error"],
        // "array-callback-return": ["error", { "checkForEach": true }],
        "for-direction": ["error"],
        "no-const-assign": ["error"],
        "no-cond-assign": ["error", "always"],
        "no-constant-condition": ["error"],
        "no-dupe-args": ["error"],
        "no-dupe-else-if": ["error"],
        "no-dupe-keys": ["error"],
        "no-duplicate-case": ["error"],
        "no-inner-declarations": ["error"],
        "no-obj-calls": ["error"],
        "no-self-assign": ["error"],
        "no-sparse-arrays": ["error"],
        // "no-unexpected-multilin": ["error"],
        "no-unreachable": ["error"],
        "no-unsafe-finally": ["error"],
        "no-unsafe-negation": ["error"],
        "no-unsafe-optional-chaining": ["error"],
        "curly": ["error", "all"],
        // "no-case-declarations": ["error"],
        // "no-unused-vars": ["warn"],
        // "array-element-newline": ["error", {
        //   "ArrayExpression":{
        //     "multiline": true,
        //     "minItems": 3,
        //   },
        //   "ArrayPattern": "never"
        // }],
      }
    },
    {
      "files": [
        "*.html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended"
      ],
      "rules": {}
    }
  ]
}
