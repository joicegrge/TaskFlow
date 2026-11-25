import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('TaskFlow application shell', () => {
  it('keeps the shared shell and username consistent on tasks and settings', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/tasks');
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 700));
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.brand')?.textContent?.trim()).toBe('TaskFlow');
    expect(element.querySelectorAll('.task-row').length).toBe(10);
    expect(element.querySelector('.overdue')?.textContent?.trim()).toBe('3 overdue');

    await TestBed.inject(Router).navigateByUrl('/settings');
    await fixture.whenStable();
    fixture.detectChanges();

    const settingsHeading = element.querySelector('main h1')?.textContent?.trim();
    const topBarName = element.querySelector('.user-summary > span')?.textContent?.trim();
    const settingsName = element.querySelector('.field-value')?.textContent?.trim();
    const settingsLink = element.querySelector<HTMLAnchorElement>('nav a[href="/settings"]');
    expect(settingsHeading).toBe('Settings');
    expect(settingsName).toBe(topBarName);
    expect(settingsLink?.classList.contains('active')).toBe(true);
    expect(settingsLink?.getAttribute('aria-current')).toBe('page');
  });
});
