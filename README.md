# cloudfront-invalidate-cache

Simple CLI to invalidate cache for AWS CloudFront.
You can create invalidation with CNAME.

[![npm](https://img.shields.io/npm/v/cloudfront-invalidate-cache.svg)](https://www.npmjs.com/package/cloudfront-invalidate-cache)
[![NPM](https://img.shields.io/npm/l/cloudfront-invalidate-cache.svg)](LICENSE)
[![Build Status](https://travis-ci.com/shouki-s/cloudfront-invalidate-cache.svg?branch=master)](https://travis-ci.com/shouki-s/cloudfront-invalidate-cache)
[![Coverage Status](https://coveralls.io/repos/github/shouki-s/cloudfront-invalidate-cache/badge.svg?branch=master)](https://coveralls.io/github/shouki-s/cloudfront-invalidate-cache?branch=master)

## Installation

```bash
npm install cloudfront-invalidate-cache --save
```

Also, you can install with `-g` (global) option. Alternatively, you can use `npx` to run it without installing.

## AWS permissions

You need 2 permissions to run cloudfront-invalidate-cache.

- `cloudfront:CreateInvalidation`
- `cloudfront:ListDistributions`

The minimum policy to run is below.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudFrontInvalidateCache",
            "Effect": "Allow",
            "Action": [
                "cloudfront:ListDistributions",
                "cloudfront:CreateInvalidation"
            ],
            "Resource": "*"
        }
    ]
}
```

## Usage

```bash
cloudfront-invalidate-cache --cname your.domain.example.com
```

Or, without installing,

```bash
npx cloudfront-invalidate-cache --cname your.domain.example.com
```

## Argument

cloudfront-invalidate-cache has only one argument.

### `--cname <domain name>` (require)

CNAME alias for the distribution.

## APIs

```javascript
const { invalidateCache } = require('cloudfront-invalidate-cache');

invalidateCache('your.domain.example.com')
  .then(() => {
    console.log('done!');
  })
  .catch(err => {
    console.error(err);
  });
```
