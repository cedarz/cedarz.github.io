'use strict';

const { exists, readFile } = require('hexo-fs');
const { basename, extname, join, posix } = require('path');
const { htmlTag, url_for } = require('hexo-util');

const rCaptionTitleFile = /(.*)?(?:\s+|^)(\/*\S+)/;
const rLang = /\s*lang:(\w+)/i;
const rFrom = /\s*from:(\d+)/i;
const rTo = /\s*to:(\d+)/i;

/**
 * Override Hexo 7.2+ include_code: read files from code_dir directly.
 * Built-in tag looks up Page model, which misses non-renderable extensions
 * (e.g. .py, .cpp, .cs) and files under skip_render paths.
 */
hexo.extend.tag.unregister('include_code');
hexo.extend.tag.unregister('include-code');

hexo.extend.tag.register('include_code', function includeCodeTag(args) {
  const ctx = hexo;
  let codeDir = ctx.config.code_dir;
  let arg = args.join(' ');

  if (!codeDir.endsWith('/')) codeDir += '/';

  let lang = '';
  arg = arg.replace(rLang, (match, _lang) => {
    lang = _lang;
    return '';
  });

  let from = 0;
  arg = arg.replace(rFrom, (match, _from) => {
    from = _from - 1;
    return '';
  });

  let to = Number.MAX_VALUE;
  arg = arg.replace(rTo, (match, _to) => {
    to = _to;
    return '';
  });

  const match = arg.match(rCaptionTitleFile);
  if (!match) return;

  const path = match[2];
  lang = lang || extname(path).substring(1);

  const src = join(ctx.source_dir, codeDir, path);
  const rawPath = posix.join(codeDir, path).replace(/\\/g, '/');
  const title = match[1] || basename(path);
  const caption = htmlTag('span', {}, title)
    + `<a href="${url_for.call(ctx, rawPath)}">view raw</a>`;

  return exists(src).then(exist => {
    if (!exist) return;
    return readFile(src);
  }).then(code => {
    if (!code) return;

    const lines = code.split('\n');
    code = lines.slice(from, to).join('\n').trim();

    if (ctx.extend.highlight.query(ctx.config.syntax_highlighter)) {
      return ctx.extend.highlight.exec(ctx.config.syntax_highlighter, {
        context: ctx,
        args: [code, { lang, caption, lines_length: lines.length }]
      });
    }

    return `<pre><code>${code}</code></pre>`;
  });
}, { async: true });
