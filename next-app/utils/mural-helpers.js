export function getFavoritePhoto(mural) {
  const photos = mural?.photos;
  if (!photos || photos.length === 0) return null;
  return photos.reduce((best, photo) =>
    (photo.likes?.length || 0) > (best.likes?.length || 0) ? photo : best
  );
}
