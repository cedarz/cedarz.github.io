'use strict';

const { escapeHTML } = require('hexo-util');

const MODES = {
  perline: 'perline',
  'per-line': 'perline',
  pre: 'perline',
  multiline: 'multiline',
  multi: 'multiline',
  md: 'multiline',
  markdown: 'multiline'
};

/**
 * {% poem %} ... {% endpoem %}
 * {% poem perline %} ... {% endpoem %}
 * {% poem multiline %} ... {% endpoem %}
 *
 * perline (default): preserve source line breaks via white-space: pre-line
 * multiline: render inner content as Markdown (blank line = new paragraph)
 */
hexo.extend.tag.register('poem', function poemTag(args, content) {
  const mode = MODES[(args[0] || 'perline').toLowerCase()] || 'perline';
  const className = `poem poem--${mode}`;

  if (mode === 'multiline') {
    content = hexo.render.renderSync({ text: content, engine: 'markdown' });
    return `<div class="${className}">\n${content.trim()}\n</div>`;
  }

  return `<div class="${className}">${escapeHTML(content.trim())}</div>`;
}, true);
