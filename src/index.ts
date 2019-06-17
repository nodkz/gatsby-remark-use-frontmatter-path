import visit from 'unist-util-visit';
import isRelativeUrl from 'is-relative-url';
import path from 'path';
import grayMatter from 'gray-matter';

interface LinkData {
  markdownNode: any;
  linkAbsolutePath: string;
  localFileNode: any;
  linkHash?: string;
  linkPath: string;
}

module.exports = async (meta: any) => {
  const { markdownAST, getNode, markdownNode, files, loadNodeContent } = meta;
  const linksInMarkdown: LinkData[] = [];

  // obtain dir for current file
  let fileDir = '';
  const fileNode = getNode(markdownNode.parent);
  if (fileNode.internal.type === `File`) {
    fileDir = fileNode.dir;
  }

  // find markdown links which present in Gatsby files
  visit(markdownAST, 'link', (node: any) => {
    let [linkPath, linkHash] = node.url.split('#');

    let linkAbsolutePath = linkPath;
    if (isRelativeUrl(linkPath)) {
      linkAbsolutePath = path.join(fileDir, linkPath);
    }

    const localFileNode = files.find((f: any) => f.absolutePath === linkAbsolutePath);
    if (localFileNode) {
      linksInMarkdown.push({
        markdownNode: node,
        linkAbsolutePath,
        localFileNode,
        linkHash,
        linkPath,
      });
    }
  });

  if (linksInMarkdown.length > 0) {
    for (const item of linksInMarkdown) {
      const linkFileContent = await loadNodeContent(item.localFileNode);
      if (linkFileContent) {
        const frontmatter = grayMatter(linkFileContent);
        if (frontmatter && frontmatter.data && frontmatter.data.path) {
          // console.log('CHANGE:', item.markdownNode.url, '->', frontmatter.data.path);
          let newUrl = frontmatter.data.path;
          if (item.linkHash) newUrl = `${newUrl}#${item.linkHash}`;
          item.markdownNode.url = newUrl;
        }
      }
    }
  }

  return markdownAST;
};
