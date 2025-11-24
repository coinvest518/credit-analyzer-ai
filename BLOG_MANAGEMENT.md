# Blog Management Guide

## How to Add/Edit Blog Posts

All blog content is managed in a single file: `blogData.ts`

### Adding a New Blog Post

1. Open `blogData.ts`
2. Add a new object to the `blogPosts` array:

```typescript
{
  id: 8, // Increment from last post
  title: "Your Blog Post Title",
  excerpt: "A short summary (1-2 sentences)",
  category: "Credit Education", // or "Legal Rights", "How-To Guides", etc.
  author: "Your Name",
  date: "Dec 20, 2024",
  image: "https://images.unsplash.com/photo-xxxxx", // Use Unsplash or your own
  featured: false, // Set to true for main featured post
  content: `
# Your Blog Post Title

Write your content here using markdown syntax.

## Section Heading

Your paragraph text here.

### Subsection

- Bullet point 1
- Bullet point 2

**Bold text** for emphasis.

\`\`\`
Code blocks for examples
\`\`\`
  `
}
```

### Markdown Syntax Supported

- `# Heading 1` - Main title
- `## Heading 2` - Section heading
- `### Heading 3` - Subsection heading
- `**bold text**` - Bold text
- `- item` - Bullet list
- `` `code` `` - Inline code
- ` ```code block``` ` - Code block

### Tips

1. **Keep one featured post**: Only set `featured: true` for one post
2. **Use high-quality images**: Recommended size 800x600px or larger
3. **Write clear excerpts**: Keep under 150 characters
4. **Organize by category**: Use consistent category names
5. **Update dates**: Use format "Dec 20, 2024"

### Example Categories

- Credit Education
- Legal Rights
- How-To Guides
- Success Stories
- Industry News
- Credit Tips

### Finding Images

Free stock photos:
- [Unsplash](https://unsplash.com) - Search for "finance", "credit", "business"
- [Pexels](https://pexels.com)
- Use format: `https://images.unsplash.com/photo-xxxxx?w=800&h=600&fit=crop`

### Editing Existing Posts

1. Find the post by `id` in `blogData.ts`
2. Edit any field (title, content, image, etc.)
3. Save the file - changes appear immediately

### Deleting Posts

Simply remove the post object from the `blogPosts` array in `blogData.ts`

## That's It!

No database, no CMS, no complicated setup. Just edit one file and you're done! 🎉
