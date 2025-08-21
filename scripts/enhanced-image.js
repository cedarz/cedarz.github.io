'use strict';

// console.log('=== Enhanced Image Plugin Loading ===');
// console.log('Registering enhanced_img tag...');

// 预定义的样式配置
const imageConfig = {
  sizes: {
    xs: '200px',
    small: '300px', 
    medium: '500px',
    large: '700px',
    xl: '900px',
    full: '100%'
  },
  
  styles: {
    bordered: 'border: 1px solid #e1e8ed; border-radius: 8px; padding: 4px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);',
    shadow: 'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); border-radius: 8px;',
    rounded: 'border-radius: 12px;',
    clean: 'border: none; border-radius: 4px;',
    card: 'border: 1px solid #f0f0f0; border-radius: 12px; padding: 8px; background: #fff; box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);',
    minimal: 'border: none; border-radius: 0;',
    modern: 'border-radius: 16px; border: 1px solid #f5f5f5; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); padding: 6px;',
    vintage: 'border: 3px solid #8B4513; border-radius: 4px; padding: 8px; background: #FFF8DC; box-shadow: inset 0 0 10px rgba(139, 69, 19, 0.1);'
  },
  
  alignments: {
    left: 'text-align: left;',
    center: 'text-align: center;',
    right: 'text-align: right;'
  }
};

// 注册支持 {% image %}...{% endimage %} 语法的标签
hexo.extend.tag.register('image', function(args, content) {
  // console.log('Image tag called with args:', args, 'content:', content);
  
  const [src, size = 'medium', style = 'bordered', align = 'center', ...altParts] = args;
  
  if (!src) {
    console.warn('Enhanced Image: src is required');
    return '<p style="color: red;">Error: Image src is required</p>';
  }
  
  // 获取配置值
  const imageWidth = imageConfig.sizes[size] || size;
  const imageStyle = imageConfig.styles[style] || '';
  const containerAlign = imageConfig.alignments[align] || 'text-align: center;';
  const alt = altParts.join(' ') || '';
  const hasCaption = content && content.trim();
  
  // 基础图片样式
  const baseImageStyle = `max-width: 100%; height: auto; ${imageWidth !== '100%' ? `width: ${imageWidth};` : ''} ${imageStyle}`;
  const containerStyle = `${containerAlign} margin: 20px 0;`;
  
  if (hasCaption) {
    // 有标题的情况
    const captionStyle = `margin-top: 12px; font-size: 0.9em; color: #666; line-height: 1.6;`;
    
    return `
      <figure style="${containerStyle}">
        <img src="${src}" alt="${alt || content.trim()}" style="${baseImageStyle} cursor: zoom-in;" loading="lazy" onclick="openImageModal(this)">
        <figcaption style="${captionStyle}">${content.trim()}</figcaption>
      </figure>
    `;
  } else {
    // 无标题的情况
    return `
      <div style="${containerStyle}">
        <img src="${src}" alt="${alt}" style="${baseImageStyle} cursor: zoom-in;" loading="lazy" onclick="openImageModal(this)">
      </div>
    `;
  }
}, { ends: true }); // 简化配置



// 注入CSS和JavaScript
hexo.extend.injector.register('head_end', `
<style>
/* Enhanced Image 样式 */
.enhanced-image:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

/* 模态框样式 */
.image-modal {
  display: none;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  cursor: zoom-out;
}

.image-modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90%;
  max-height: 90%;
  text-align: center;
}

.image-modal img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.image-modal .close {
  position: absolute;
  top: 20px;
  right: 30px;
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
}

.image-modal .close:hover {
  opacity: 0.7;
}

/* 响应式 */
@media (max-width: 768px) {
  img[style*="width"] {
    width: 100% !important;
  }
}
</style>
`);

hexo.extend.injector.register('body_end', `
<div id="imageModal" class="image-modal">
  <span class="close">×</span>
  <div class="image-modal-content">
    <img id="modalImage" src="" alt="">
  </div>
</div>

<script>
function openImageModal(img) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  
  modal.style.display = 'block';
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  
  // 关闭事件
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  }
  
  document.querySelector('.image-modal .close').onclick = function() {
    modal.style.display = 'none';
  }
  
  document.onkeydown = function(event) {
    if (event.key === 'Escape') {
      modal.style.display = 'none';
    }
  }
}
</script>
`);

// console.log('=== Enhanced Image Plugin Loaded ===');
// console.log('All tags registered successfully!');

// 注册 enhanced_img 标签
hexo.extend.tag.register('enhanced_img', function(args) {
  // console.log('Enhanced_img tag called with args:', args);
  
  const src = args[0];
  const size = args[1] || 'medium';
  const style = args[2] || 'bordered';
  const align = args[3] || 'center';
  const altParts = args.slice(4);
  
  // console.log('Parsed args:', { src, size, style, align, altParts });
  
  if (!src) {
    return '<p style="color: red;">Error: Image src is required</p>';
  }
  
  const imageWidth = imageConfig.sizes[size] || size;
  const imageStyle = imageConfig.styles[style] || '';
  const containerAlign = imageConfig.alignments[align] || 'text-align: center;';
  
  // 检查是否有标题（如果参数数量大于4，最后一个参数视为标题）
  const hasCaption = altParts.length > 0;
  
  // console.log('Caption check:', { altParts, hasCaption });
  
  let alt, caption;
  if (hasCaption) {
    // 有标题的情况，最后一个参数是标题，其他是alt
    caption = altParts[altParts.length - 1];
    alt = altParts.slice(0, -1).join(' ') || caption;
    // console.log('Has caption:', { caption, alt });
  } else {
    // 无标题的情况，所有参数都是alt
    alt = altParts.join(' ') || '';
    // console.log('No caption:', { alt });
  }
  
  const baseImageStyle = `max-width: 100%; height: auto; ${imageWidth !== '100%' ? `width: ${imageWidth};` : ''} ${imageStyle}`;
  const containerStyle = `${containerAlign} margin: 20px 0;`;
  
  let result;
  if (hasCaption) {
    // 有标题的情况
    const captionStyle = `margin-top: 12px; font-size: 0.9em; color: #666; line-height: 1.6;`;
    
    result = '<figure style="' + containerStyle + '"><img src="' + src + '" alt="' + alt + '" style="' + baseImageStyle + ' cursor: zoom-in;" loading="lazy" onclick="openImageModal(this)"><figcaption style="' + captionStyle + '">' + caption + '</figcaption></figure>';
  } else {
    // 无标题的情况
    result = '<div style="' + containerStyle + '"><img src="' + src + '" alt="' + alt + '" style="' + baseImageStyle + ' cursor: zoom-in;" loading="lazy" onclick="openImageModal(this)"></div>';
  }
  
  // console.log('Enhanced_img generated HTML:', result);
  return result;
});