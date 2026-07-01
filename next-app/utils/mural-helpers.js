// Strapi has no equivalent of the old Mongoose Mural.favoritePhoto
// convenience field (dropped in Phase 2 - see MIGRATION_NOTES.md §6):
// Photo/Like are now first-class content types, so "the mural's featured
// photo" is computed here instead of read off a stored, denormalized field.
// Most-liked photo wins; ties (including the common zero-likes case) fall
// back to the first photo.
export function getFavoritePhoto(mural) {
  const photos = mural?.photos;
  if (!photos || photos.length === 0) return null;
  return photos.reduce((best, photo) =>
    (photo.likes?.length || 0) > (best.likes?.length || 0) ? photo : best
  );
}
