# cloudfront-invalidate-cache

Simple CLI to invalidate cache for AWS CloudFront.
You can create invalidation with CNAME.

## Installation

```bash
npm install cloudfront-invalidate-cache --save
```

Also, you can install with `-g` (global) option.

## Usage

```bash
cloudfront-invalidate-cache --cname your.domain.example.com
```

## Arguments

### `--cname` (require)

CNAME alias for the distribution.
