# cloudfront-invalidate-cache

Simple CLI to invalidate cache for AWS CloudFront.
You can create invalidation with CNAME.

## Installation

```bash
npm install https://github.com/shouki-s/cloudfront-invalidate-cache.git --save
```

Also, you can install with `-g` (global) option.

## Usage

```bash
cloudfront-invalidate-cache --cname your.domain.example.com
```

## Arguments

### `--cname` (require)

CNAME alias for the distribution.
