import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createLocalState, clearProgress, mountTours, isBuilderMounted, type Tour } from '@tours/core';
import type { MountHandle } from '@tours/core';

const state = createLocalState();

/**
 * A tour that crosses a client-side route.
 *
 * The first step is interactive: the visitor clicks the real link, Angular's
 * router moves the app, and the player advances because the next step's
 * `pageUrl` starts matching. Nothing here navigates on the tour's behalf —
 * which is the whole point, since a host app owns its own routing.
 */
const routed: Tour = {
  id: 'routed',
  schemaVersion: 2,
  title: { default: 'Across routes' },
  trigger: { type: 'manual' },
  steps: [
    {
      id: 'go',
      selectors: ['#to-settings'],
      content: { default: 'Click this link yourself — the tour follows the router.' },
      placement: 'bottom',
      action: { type: 'click' },
      pageUrl: { glob: '**#/' },
    },
    {
      id: 'profile',
      selectors: ['#profile'],
      content: { default: 'Arrived on /settings without a reload.' },
      placement: 'bottom',
      pageUrl: { glob: '**#/settings*' },
    },
    {
      id: 'danger',
      selectors: ['#danger'],
      content: { default: 'Last step.' },
      placement: 'bottom',
      pageUrl: { glob: '**#/settings*' },
    },
  ],
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  styles: [
    `
      :host { display: block; font: 16px/1.55 system-ui, sans-serif; padding: 2rem 1.5rem 5rem; }
      .wrap { max-width: 44rem; margin: 0 auto; }
      h1 { font-size: 1.3rem; margin: 0 0 .25rem; }
      .sub { color: #6b7280; margin: 0 0 1.75rem; }
      .panel { border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.1rem; margin: 0 0 1.1rem; }
      .row { display: flex; gap: .6rem; flex-wrap: wrap; align-items: center; margin-top: .75rem; }
      button, .btn {
        font: inherit; padding: .5rem 1rem; border: 1px solid #d1d5db; border-radius: 8px;
        background: #fff; cursor: pointer; text-decoration: none; color: inherit; display: inline-block;
      }
      button.primary { background: #111827; color: #fff; border-color: #111827; }
      code { background: #f3f4f6; padding: .1rem .35rem; border-radius: 4px; }
      pre { font: 12px/1.5 ui-monospace, Menlo, monospace; white-space: pre-wrap;
            max-height: 11rem; overflow: auto; margin: 0; color: #374151; }
    `,
  ],
  template: `
    <div class="wrap">
      <h1>Tours — Angular sandbox</h1>
      <p class="sub">
        Hash-routed SPA. Open with <code>?tours-edit=1</code> for the builder.
        {{ builderNote() }}
      </p>

      <div class="panel"><router-outlet /></div>

      <div class="panel">
        <strong>Run</strong>
        <div class="row">
          <button class="primary" (click)="startRouted()">Cross-route tour</button>
          <button (click)="reset()">Reset progress</button>
        </div>
      </div>

      <div class="panel">
        <strong>Events</strong>
        <pre>{{ log() }}</pre>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  readonly log = signal('…');
  readonly builderNote = signal('');
  private tours: MountHandle | null = null;
  private lines: string[] = [];

  private push(line: string): void {
    this.lines = [...this.lines.slice(-40), line];
    this.log.set(this.lines.join('\n'));
  }

  ngOnInit(): void {
    this.builderNote.set(isBuilderMounted() ? 'Builder is mounted — tours are suppressed.' : '');

    // One call. It resumes anything in flight and re-checks on every route
    // change, so nothing has to be repeated per page.
    this.tours = mountTours([routed], {
      state,
      on: {
        tourStarted: ({ index }) => this.push(`▶ started at ${index}`),
        stepChanging: ({ from, to }) => this.push(`  ${from} → ${to}`),
        stepActivated: ({ step }) => this.push(`● ${step.id}`),
        stepSkipped: ({ step, reason }) => this.push(`↷ ${step.id} (${reason})`),
        tourCompleted: () => this.push('✔ completed'),
        tourDismissed: ({ index }) => this.push(`✕ dismissed at ${index}`),
      },
    });
  }

  ngOnDestroy(): void {
    this.tours?.unmount();
  }

  startRouted(): void {
    this.lines = [];
    // The first step lives on '/', so make sure we are there before starting.
    if (location.hash !== '#/') location.hash = '#/';
    // Through the mount, not a bare createPlayer — otherwise the mount would be
    // unaware of the running tour and could start a second one on the next
    // route change.
    setTimeout(() => this.tours?.start('routed'), 0);
  }

  reset(): void {
    clearProgress(state);
    this.push('progress cleared');
  }
}
