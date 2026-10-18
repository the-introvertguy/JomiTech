export function formatNumeral(
  val: string | number | null | undefined,
  numeralMode: 'bn' | 'en' = 'bn'
): string {
  if (val === null || val === undefined) return '';
  const str = String(val);

  if (numeralMode === 'en') {
    const bnToEnMap: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
    };
    return str.replace(/[০-৯]/g, (char) => bnToEnMap[char] || char);
  }

  // Convert English digits to Bengali digits
  const enToBnMap: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return str.replace(/[0-9]/g, (char) => enToBnMap[char] || char);
}
