<?php
/**
 * Admin menu: a top-level "Site Tours" menu with an overview page that lists
 * the site's tours and opens the builder. The builder runs on the front-end
 * (that is where the real elements are), so "Open builder" links to the site
 * with the ?tours-edit=1 flag.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Site_Tours_Admin {

	const MENU = 'site-tours';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
	}

	public static function menu() {
		add_menu_page(
			__( 'Site Tours', 'site-tours' ),
			__( 'Site Tours', 'site-tours' ),
			'edit_posts',
			self::MENU,
			array( __CLASS__, 'render_overview' ),
			'dashicons-location-alt',
			26
		);
		// Rename the auto-created first submenu from the menu title to "Overview".
		add_submenu_page(
			self::MENU,
			__( 'Overview', 'site-tours' ),
			__( 'Overview', 'site-tours' ),
			'edit_posts',
			self::MENU,
			array( __CLASS__, 'render_overview' )
		);
	}

	/** URL of the site front-end with the builder flag. */
	public static function builder_url() {
		return add_query_arg( 'tours-edit', '1', home_url( '/' ) );
	}

	public static function render_overview() {
		$builder_url = self::builder_url();
		$tours       = get_posts(
			array(
				'post_type'   => Site_Tours_CPT::POST_TYPE,
				'post_status' => array( 'publish', 'draft', 'pending', 'private' ),
				'numberposts' => -1,
			)
		);
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Site Tours', 'site-tours' ); ?></h1>
			<p><?php esc_html_e( 'Build guided tours on your own pages. The builder opens on your site, where you pick elements and write hints.', 'site-tours' ); ?></p>

			<p>
				<a class="button button-primary button-hero" href="<?php echo esc_url( $builder_url ); ?>" target="_blank" rel="noopener">
					<?php esc_html_e( 'Open the builder on your site ↗', 'site-tours' ); ?>
				</a>
			</p>

			<h2><?php esc_html_e( 'Your tours', 'site-tours' ); ?></h2>
			<?php if ( empty( $tours ) ) : ?>
				<p><em><?php esc_html_e( 'No tours yet — open the builder to create one.', 'site-tours' ); ?></em></p>
			<?php else : ?>
				<table class="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Name', 'site-tours' ); ?></th>
							<th><?php esc_html_e( 'Status', 'site-tours' ); ?></th>
							<th><?php esc_html_e( 'Steps', 'site-tours' ); ?></th>
							<th><?php esc_html_e( 'Kind', 'site-tours' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php
						foreach ( $tours as $tour ) :
							$data  = json_decode( $tour->post_content, true );
							$steps = ( is_array( $data ) && isset( $data['steps'] ) && is_array( $data['steps'] ) ) ? count( $data['steps'] ) : 0;
							$kind  = get_post_meta( $tour->ID, Site_Tours_CPT::META_KIND, true );
							$kind  = ( 'template' === $kind ) ? __( 'Template', 'site-tours' ) : __( 'Tour', 'site-tours' );
							?>
							<tr>
								<td><strong><?php echo esc_html( $tour->post_title ); ?></strong></td>
								<td><?php echo esc_html( 'publish' === $tour->post_status ? __( 'Published', 'site-tours' ) : __( 'Draft', 'site-tours' ) ); ?></td>
								<td><?php echo esc_html( (string) $steps ); ?></td>
								<td><?php echo esc_html( $kind ); ?></td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			<?php endif; ?>

			<h2><?php esc_html_e( 'Add a trigger', 'site-tours' ); ?></h2>
			<p><?php esc_html_e( 'Place this shortcode where visitors should start a tour:', 'site-tours' ); ?></p>
			<p><code>[site_tour id="…" label="Start tour"]</code></p>
		</div>
		<?php
	}
}
