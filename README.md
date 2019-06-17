# cloudfront-invalidate-cache

Simple CLI to invalidate cache for AWS CloudFront.
You can create invalidation with CNAME.

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
