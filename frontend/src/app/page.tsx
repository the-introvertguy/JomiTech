import { redirect } from 'next/navigation';

export default function RootPage() {
  // First visit must be Bangla as required
  redirect('/bn');
}
