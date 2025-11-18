/**
 * 云文档导出工具函数
 * 支持导出为 Word、PDF 和长图片
 */

/**
 * 导出为 Word 文档
 */
export async function exportToWord(title: string, content: string) {
  try {
    // 动态导入 docx 库
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
    
    // 将 HTML 内容转换为段落数组
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const paragraphs: any[] = [
      new Paragraph({
        text: title || '无标题文档',
        heading: HeadingLevel.HEADING_1,
      }),
    ];
    
    // 遍历所有子节点，转换为段落
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          paragraphs.push(new Paragraph({
            text: text,
          }));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();
        
        if (tagName === 'p' || tagName === 'div') {
          const text = element.textContent?.trim();
          if (text) {
            paragraphs.push(new Paragraph({
              text: text,
            }));
          }
        } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
          const text = element.textContent?.trim();
          if (text) {
            paragraphs.push(new Paragraph({
              text: text,
              heading: tagName === 'h1' ? HeadingLevel.HEADING_1 : 
                       tagName === 'h2' ? HeadingLevel.HEADING_2 : 
                       HeadingLevel.HEADING_3,
            }));
          }
        } else {
          // 递归处理子节点
          Array.from(element.childNodes).forEach(processNode);
        }
      }
    };
    
    Array.from(tempDiv.childNodes).forEach(processNode);
    
    // 如果没有内容，添加一个空段落
    if (paragraphs.length === 1) {
      paragraphs.push(new Paragraph({
        text: tempDiv.textContent || '',
      }));
    }
    
    // 创建 Word 文档
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // 生成并下载
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || '文档'}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出 Word 失败:', error);
    // 如果 docx 库未安装，使用简单的 HTML 转 Word 方法
    exportToWordSimple(title, content);
  }
}

/**
 * 简单的 Word 导出（使用 HTML 格式）
 */
function exportToWordSimple(title: string, content: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: "Microsoft YaHei", Arial, sans-serif; padding: 20px; }
        h1 { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${content}
    </body>
    </html>
  `;
  
  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title || '文档'}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 导出为 PDF
 */
export async function exportToPDF(title: string, content: string) {
  try {
    // 动态导入 jsPDF 和 html2canvas
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    
    // 创建临时容器来渲染内容
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '800px';
    tempDiv.style.padding = '40px';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.innerHTML = `
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #000;">${title}</h1>
      <div style="line-height: 1.6; color: #333;">${content}</div>
    `;
    document.body.appendChild(tempDiv);
    
    // 使用 html2canvas 转换为图片
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    document.body.removeChild(tempDiv);
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 宽度（mm）
    const pageHeight = 297; // A4 高度（mm）
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // 如果内容超过一页，添加新页
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${title || '文档'}.pdf`);
  } catch (error) {
    console.error('导出 PDF 失败:', error);
    alert('导出 PDF 失败，请确保已安装相关依赖库');
  }
}

/**
 * 导出为长图片
 */
export async function exportToImage(title: string, content: string) {
  try {
    // 动态导入 html2canvas
    const html2canvas = (await import('html2canvas')).default;
    
    // 创建临时容器来渲染内容
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '1200px'; // 增加宽度以提高清晰度
    tempDiv.style.padding = '60px';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", Arial, sans-serif';
    tempDiv.style.fontSize = '16px';
    tempDiv.style.lineHeight = '1.8';
    tempDiv.style.color = '#333333';
    tempDiv.innerHTML = `
      <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 30px; color: #000; line-height: 1.4;">${title || '无标题文档'}</h1>
      <div style="line-height: 1.8; color: #333; font-size: 16px;">${content}</div>
    `;
    document.body.appendChild(tempDiv);
    
    // 等待内容渲染完成
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 使用 html2canvas 转换为图片，提高清晰度
    const canvas = await html2canvas(tempDiv, {
      scale: 4, // 提高到 4 倍缩放，大幅提升清晰度
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      width: tempDiv.offsetWidth,
      height: tempDiv.scrollHeight,
      windowWidth: tempDiv.scrollWidth,
      windowHeight: tempDiv.scrollHeight,
      removeContainer: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // 确保克隆的文档中所有图片都已加载
        const clonedDiv = clonedDoc.querySelector('div');
        if (clonedDiv) {
          const images = clonedDiv.querySelectorAll('img');
          images.forEach((img: HTMLImageElement) => {
            if (!img.complete) {
              img.style.display = 'none';
            }
          });
        }
      },
    });
    
    document.body.removeChild(tempDiv);
    
    // 下载图片，使用最高质量
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title || '文档'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0); // 使用最高质量（1.0）
  } catch (error) {
    console.error('导出图片失败:', error);
    alert('导出图片失败，请确保已安装 html2canvas 库');
  }
}

