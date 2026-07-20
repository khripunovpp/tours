<?php
/**
 * Runs when the user deletes the plugin. Removes the tours it created (posts +
 * their meta). Only fires on explicit uninstall, never on deactivation.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$site_tours_ids = get_posts(
	array(
		'post_type'   => 'site_tour',
		'post_status' => 'any',
		'numberposts' => -1,
		'fields'      => 'ids',
	)
);

foreach ( $site_tours_ids as $site_tours_id ) {
	wp_delete_post( $site_tours_id, true );
}
