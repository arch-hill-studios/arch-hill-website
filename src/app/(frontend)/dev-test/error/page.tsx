// Force this page to be dynamically rendered, not statically generated
export const dynamic = 'force-dynamic';

export default function ErrorTestPage() {
  // Throw a server error to test the error.tsx page
  throw new Error('This is a test server error to demonstrate the error page functionality');
}
