import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const hub = z.enum(['planning', 'rules', 'hiring', 'during', 'rooms']);

// One Markdown file per guide. The file name is the URL slug: /{hub path}/{file name}/.
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().max(80),
    metaTitle: z.string().max(60),
    description: z.string().min(70).max(160),
    hub,
    alsoIn: z.array(hub).default([]),
    order: z.number().int(),
    updated: z.coerce.date(),
    summary: z.string().max(320),
    /** Card illustration in public/illo/ (no extension). Its alt text is empty on cards: the title says it. */
    illo: z.string(),
    // Every guide rests on sources a reader can check. A guide with none does not build.
    sources: z.array(z.object({ label: z.string(), url: z.url() })).min(1),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    // The enquiry form after the guide, where the reader is likely to want quotes.
    enquiry: z
      .object({
        heading: z.string().max(80),
        lede: z.string().max(240).optional(),
      })
      .optional(),
  }),
});

export const collections = { guides };
