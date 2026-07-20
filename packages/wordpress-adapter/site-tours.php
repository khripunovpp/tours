<?php
/**
 * Plugin Name:       Site Tours
 * Description:       Build guided tours on your own site and show them to visitors — no extra install required. Free and open.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       site-tours
 *
 * A thin adapter: it stores tours (as a custom post type), guards access, and
 * enqueues the shared player/editor bundles. All tour logic lives in the
 * bundles, not here.
 */

// Block direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SITE_TOURS_VERSION', '0.1.0' );
define( 'SITE_TOURS_FILE', __FILE__ );
define( 'SITE_TOURS_DIR', plugin_dir_path( __FILE__ ) );
define( 'SITE_TOURS_URL', plugin_dir_url( __FILE__ ) );

require_once SITE_TOURS_DIR . 'includes/class-site-tours-cpt.php';
require_once SITE_TOURS_DIR . 'includes/class-site-tours-rest.php';
require_once SITE_TOURS_DIR . 'includes/class-site-tours-assets.php';
require_once SITE_TOURS_DIR . 'includes/class-site-tours-admin.php';

Site_Tours_CPT::init();
Site_Tours_REST::init();
Site_Tours_Assets::init();

if ( is_admin() ) {
	Site_Tours_Admin::init();
}

// Register the post type on activation, then refresh rewrite rules once.
register_activation_hook(
	__FILE__,
	static function () {
		Site_Tours_CPT::register();
		flush_rewrite_rules();
	}
);

register_deactivation_hook(
	__FILE__,
	static function () {
		flush_rewrite_rules();
	}
);
