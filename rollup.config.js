import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

const standard = {
  input: 'src/index.js',
  output: {
    format: 'umd',
    name: 'simpleUpdateIn'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};

export default [{
  ...standard,
  output: {
    ...standard.output,
    file: 'dist/simple-update-in.production.min.js'
  },
  plugins: [
    ...standard.plugins,
    uglify()
  ]
}, {
  ...standard,
  output: {
    ...standard.output,
    file: 'dist/simple-update-in.development.js'
  }
}]
