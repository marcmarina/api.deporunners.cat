module.exports = {
  extends: ['@deporunners/eslint-config'],
  root: false,
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
  ],
};
