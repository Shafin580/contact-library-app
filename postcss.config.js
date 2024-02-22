module.exports = {
  plugins: {
    tailwindcss: {},
    "postcss-preset-env": {
      stage: 3,
      features: {
        "custom-properties": false,
      },
    },
  },
}
