# Migration Log

Run at: 2026-07-01T00:03:39.777Z

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
| 6a4450a114858a824c3f6592 | alice_mongo | gnsh2kqsl2fk8r7e8tarx1t2 |
| 6a4450a114858a824c3f6594 | bob_mongo | g0h464lnqhfm7va16g3j013r |
| 6a4450a114858a824c3f6596 | carol_mongo | k5ug2h39x89o8spbn2r1uq8v |

### Murals (Mongo `_id` -> Strapi `documentId`)

| Mongo _id | title | Strapi documentId |
|---|---|---|
| 6a4450a114858a824c3f6599 | Riverwalk Mosaic | li6hj3tc6dtxa6xlc7w4tlnm |
| 6a4450a114858a824c3f659d | Quiet Alley Wall | fqo0fitamcdylylpqc3mdq7b |
| 6a4450a114858a824c3f65a0 | Public Plaza Piece | c5dp4a71u04g59x4zzjjsnup |
| 6a4450a114858a824c3f65a3 | Empty Lot Backdrop | td6mglaexk6w6kpbw8o0za2k |
| 6a4450a114858a824c3f65a5 | Underpass Tribute | jo3ngev1rericq7m7ididiak |

### Photos (Mongo photo subdoc `_id` -> Strapi `documentId`)

| Mongo photo _id | parent mural | Strapi documentId |
|---|---|---|
| 6a4450a114858a824c3f659a | Riverwalk Mosaic | tc8fki69huje3imhsm9ye4o6 |
| 6a4450a114858a824c3f659b | Riverwalk Mosaic | aann5qy1wi9vav1819671vvv |
| 6a4450a114858a824c3f659e | Quiet Alley Wall | krin90a8qw4n8p3gg2n1x3b2 |
| 6a4450a114858a824c3f65a1 | Public Plaza Piece | qk6vwodz37jvjh075g2gi6ew |
| 6a4450a114858a824c3f65a6 | Underpass Tribute | i9ls21go72feyyzei14ezhr8 |

## Skipped Records

- **[Like]** referenced user does not exist or failed to migrate — user 6a4450a114858a824c3f6598 on photo 6a4450a114858a824c3f65a6 (mural "Underpass Tribute")
- **[Favorite]** referenced user does not exist or failed to migrate — user 6a4450a114858a824c3f6598 favoriting mural "Underpass Tribute" (6a4450a114858a824c3f65a5)

## Warnings (non-fatal)

- **[Photo]** HEAD https://aitw.s3.us-west-2.amazonaws.com/fake-mural-photo-1.jpg failed (NotFound) - file record created with placeholder size/mime, not verified against the bucket
- **[Photo]** HEAD https://aitw.s3.us-west-2.amazonaws.com/fake-mural-photo-2.jpg failed (NotFound) - file record created with placeholder size/mime, not verified against the bucket
- **[Photo]** HEAD https://aitw.s3.us-west-2.amazonaws.com/fake-mural-photo-1.jpg failed (NotFound) - file record created with placeholder size/mime, not verified against the bucket
