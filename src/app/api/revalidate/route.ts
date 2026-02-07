import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: 'Missing SANITY_WEBHOOK_SECRET' },
      { status: 500 }
    );
  }

  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      _id: string;
      slug?: { current?: string };
    }>(req, WEBHOOK_SECRET);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'No document type in body' },
        { status: 400 }
      );
    }

    // Revalidate by document type
    revalidateTag(body._type, 'max');

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error processing webhook', error: String(err) },
      { status: 500 }
    );
  }
}
