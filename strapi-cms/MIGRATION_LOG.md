# Migration Log

Run at: 2026-06-30T23:38:17.553Z

## Summary

| Content Type | Attempted | Succeeded | Failed |
|---|---|---|---|
| User | 3 | 3 | 0 |
| Mural | 5 | 5 | 0 |
| Photo | 5 | 5 | 0 |
| Like | 6 | 5 | 1 |
| Favorite | 5 | 4 | 1 |

## ID Mappings

### Users (Mongo `_id` -> Strapi `documentId`)

| Mongo _id | username | Strapi documentId |
|---|---|---|
| 6a4450a114858a824c3f6592 | alice_mongo | mldsdz7889ru64q82coq6886 |
| 6a4450a114858a824c3f6594 | bob_mongo | ayfg8nebd2yctjanmn4xwfjc |
| 6a4450a114858a824c3f6596 | carol_mongo | cc0api1d7rs1c2oxs7ls7ads |

### Murals (Mongo `_id` -> Strapi `documentId`)

| Mongo _id | title | Strapi documentId |
|---|---|---|
| 6a4450a114858a824c3f6599 | Riverwalk Mosaic | qudj3pv7gx821qtbwdxuvirx |
| 6a4450a114858a824c3f659d | Quiet Alley Wall | ktt09aouti7rqej960nn2j9n |
| 6a4450a114858a824c3f65a0 | Public Plaza Piece | x1h53ts32yozevjkmwicnw3e |
| 6a4450a114858a824c3f65a3 | Empty Lot Backdrop | wlw8m9kgkilvvodbuaew0vqa |
| 6a4450a114858a824c3f65a5 | Underpass Tribute | z17a4nvzulqy4f6ba6scbt3m |

### Photos (Mongo photo subdoc `_id` -> Strapi `documentId`)

| Mongo photo _id | parent mural | Strapi documentId |
|---|---|---|
| 6a4450a114858a824c3f659a | Riverwalk Mosaic | x92cak56yn5lqx09gvulv66c |
| 6a4450a114858a824c3f659b | Riverwalk Mosaic | wbmidgdzy51bat101w27z9u8 |
| 6a4450a114858a824c3f659e | Quiet Alley Wall | zrsz7kkqju8teg8gobf4uvmd |
| 6a4450a114858a824c3f65a1 | Public Plaza Piece | rstk4etrah8sgnjduygexd4s |
| 6a4450a114858a824c3f65a6 | Underpass Tribute | e8vnm19qqzf87k72yzujaf8z |

## Skipped Records

- **[Like]** referenced user does not exist or failed to migrate — user 6a4450a114858a824c3f6598 on photo 6a4450a114858a824c3f65a6 (mural "Underpass Tribute")
- **[Favorite]** referenced user does not exist or failed to migrate — user 6a4450a114858a824c3f6598 favoriting mural "Underpass Tribute" (6a4450a114858a824c3f65a5)

## Warnings (non-fatal)

- **[Photo]** HEAD https://aitw.s3.us-west-2.amazonaws.com/fake-mural-photo-1.jpg failed (NotFound) - file record created with placeholder size/mime, not verified against the bucket
- **[Photo]** HEAD https://aitw.s3.us-west-2.amazonaws.com/fake-mural-photo-2.jpg failed (NotFound) - file record created with placeholder size/mime, not verified against the bucket
- **[Photo]** HEAD https://aitw.s3.us-west-2.amazonaws.com/fake-mural-photo-1.jpg failed (NotFound) - file record created with placeholder size/mime, not verified against the bucket
