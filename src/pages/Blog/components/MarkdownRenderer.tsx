import React, { useMemo } from 'react';
import { Typography } from 'antd';
import styles from './MarkdownRenderer.less';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Simple markdown renderer component
 * Supports: headings, bold, italic, links, code blocks, lists
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const rendered = useMemo(() => {
    if (!content) return null;

    let html = content;

    // Code blocks ```code```
    html = html.replace(
      /```(.*?)\n([\s\S]*?)```/g,
      '<pre><code class="code-block">$2</code></pre>'
    );

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = `<p>${html}</p>`;

    // Unordered lists
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');

    return html;
  }, [content]);

  return (
    <div className={styles.markdownRenderer}>
      <Typography>
        <div dangerouslySetInnerHTML={{ __html: rendered || '' }} />
      </Typography>
    </div>
  );
};

export default MarkdownRenderer;
