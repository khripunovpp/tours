=== Site Tours ===
Contributors: sitetours
Tags: onboarding, tour, walkthrough, guide, tooltip
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Build guided tours on your own site by clicking elements and writing hints. Visitors see them with no install. Free and open.

== Description ==

Site Tours lets a site owner create step-by-step guided tours directly on their
own pages: click an element, write the hint, arrange the steps. Visitors see a
highlighted, step-by-step walkthrough — nothing to install on their side.

* Point-and-click authoring on your live site (for logged-in editors).
* Tours are stored as a private custom post type, so they survive updates and
  show up in your admin.
* Visitor playback is local — no visitor data is sent anywhere.
* Self-contained bundles in Shadow DOM — no conflicts with your theme or other
  plugins.

The tour logic ships as small self-contained bundles; this plugin only stores
tours, checks permissions, and loads the bundles.

== Usage ==

1. Open a page of your site while logged in as an editor.
2. Add `?tours-edit=1` to the URL to open the builder.
3. Pick elements, write hints, arrange steps, set a tour to Published.
4. Place `[site_tour id="…" label="Start tour"]` where you want a trigger, or
   trigger tours from your own code.

== Frequently Asked Questions ==

= Do visitors need to install anything? =

No. Published tours play for any visitor from your site.

= Where are tours stored? =

In a private "site_tour" custom post type in your own database.

== Changelog ==

= 0.1.0 =
* Initial release: authoring on-site, CPT storage, REST store, front-end player,
  shortcode trigger.
