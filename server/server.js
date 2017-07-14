import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import helmet from 'helmet';
import fs from 'fs';
import gzipStatic from 'connect-gzip-static';
import { resolve } from 'path';
import apiRouter from './api/index';
import config from '../src/config';
import webpackCommonConfig from '../webpack/config';

const app = express();

app.use(helmet());
app.use('/api', apiRouter);
app.use(gzipStatic(webpackCommonConfig.paths.output));
app.use(express.static('public'));
app.use(favicon(webpackCommonConfig.paths.favicon));
app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, 'views'));

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack/webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
  const bundler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(bundler, {
    hot: true,
    publicPath: webpackCommonConfig.paths.publicPath,
    stats: 'minimal'
  }));
  app.use(webpackHotMiddleware(bundler.compilers.find(compiler => compiler.name === 'client')));
  app.use(webpackHotServerMiddleware(bundler));
} else {
  const serverRenderer = require('./serverRenderer').default;
  const vendorManifest = require(webpackCommonConfig.paths.vendorManifest);
  const bundleManifest = require(webpackCommonConfig.paths.bundleManifest);
  const criticalCss = fs.readFileSync(path.join(
    webpackCommonConfig.paths.output,
    'critical.css'
  ), { encoding: 'utf8' });
  const assetsManifest = {
    bundleCss: bundleManifest['bundle.css'],
    bundleJs: bundleManifest['bundle.js'],
    vendorJs: vendorManifest['vendor.js'],
    criticalCss
  };
  app.use(serverRenderer({ assetsManifest }));
}

app.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});
