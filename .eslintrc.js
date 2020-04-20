module.exports = {
	env: {
		browser: true
	},
	extends: ['airbnb', 'prettier'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2018
	},
	plugins: ['react'],
	rules: {
		indent: ['off', 2, { ignoredNodes: ['JSXElement'] }],
		'react/jsx-indent': ['off', 2],
		indent: ['off'],
		'prefer-destructuring': [
			'error',
			{
				array: false,
				object: false
			}
		],
		'import/no-unresolved': 'off',
		'react/prefer-stateless-function': [0, { ignorePureComponents: true }],
		'import/prefer-default-export': ['off'],
		'linebreak-style': ['off'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
		'linebreak-tyle': ['off'],
		'react/prop-types': [0, { ignore: 'ignore', customValidators: 'customValidator' }]
	}
};
