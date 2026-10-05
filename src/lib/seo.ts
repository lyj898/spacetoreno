// Build-time guards. A title or description outside Google's display budget fails the build
// instead of shipping truncated.

export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 70;
export const DESCRIPTION_MAX = 160;

export function assertSeo(title: string, description: string, where: string): void {
  if (title.length > TITLE_MAX) {
    throw new Error(`${where}: title is ${title.length} chars (max ${TITLE_MAX}): "${title}"`);
  }
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    throw new Error(
      `${where}: description is ${description.length} chars (want ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}): "${description}"`
    );
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Singapore' });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
