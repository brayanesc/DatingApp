import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(value: string, now: Date = new Date()): string {
    if(!value) return '';

    const date = new Date(value);
    if(Number.isNaN(date.getTime())) return '';

    const diffSeconds = (now.getTime() - date.getTime()) / 1000;
    if (diffSeconds < 30) return 'Just now';

    const rtf = new Intl.RelativeTimeFormat(this.locale, { numeric: 'always' });

    const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
      { unit: 'year', seconds: 60 * 60 * 24 * 365 },
      { unit: 'month', seconds: 60 * 60 * 24 * 30 },
      { unit: 'week', seconds: 60 * 60 * 24 * 7 },
      { unit: 'day', seconds: 60 * 60 * 24 },
      { unit: 'hour', seconds: 60 * 60 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 },
    ];

    const chosen = units.find((u) => diffSeconds >= u.seconds) ?? units[units.length - 1];
    const n = -Math.round(diffSeconds / chosen.seconds);

    return rtf.format(n, chosen.unit);

  }

}
