export const slugToText = (slug) => {
  // Replace hyphens with spaces
  let text = slug.replace(/-/g, ' ');

  // Capitalize the first letter of each word
  text = text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return text;
};
