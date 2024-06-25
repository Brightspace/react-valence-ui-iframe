module.exports = {
	  setupFilesAfterEnv: [
		"<rootDir>/tests/setup-tests.js"
	  ],
	  testEnvironment: "jsdom",
	  transform: {
		'^.+\\.js$': 'babel-jest',
	  },
	  transformIgnorePatterns: [
		"node_modules/(?!(\@?lit|lit-html|lit-element|sinon)/)"
	  ],
	  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
  };
