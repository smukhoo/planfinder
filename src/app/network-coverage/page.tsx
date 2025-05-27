// src/app/network-coverage/page.tsx
import { notFound } from 'next/navigation';

/**
 * This page component triggers a 404 error.
 * It effectively "removes" the page from being accessible,
 * directing users to the standard Not Found page.
 */
export default function NetworkCoveragePage() {
  notFound();
  // notFound() throws an error to stop rendering and show the not-found UI.
  // Therefore, no JSX needs to be returned from this component.
}
