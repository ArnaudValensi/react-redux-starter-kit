import WebpackDevMiddleware from 'webpack-dev-middleware';
import applyExpressMiddleware from '../lib/apply-express-middleware';
import _debug from 'debug';
import config from '../../config';

const paths = config.utils_paths;
const debug = _debug('app:server:webpack-dev');

export default function (compiler, publicPath) {
  debug('Enable webpack dev middleware.');

  const middleware = WebpackDevMiddleware(compiler, {
    publicPath,
    contentBase: paths.client(),
    hot: true,
    quiet: config.compiler_quiet,
    noInfo: config.compiler_quiet,
    lazy: false,
    stats: config.compiler_stats,
  });

  return async function koaWebpackDevMiddleware(ctx, next) {
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, { // eslint-disable-line
      end: (content) => (ctx.body = content),
      setHeader(...args) {
        ctx.set.apply(ctx, args);
      },
    });

    if (hasNext) {
      await next();
    }
  };
}
