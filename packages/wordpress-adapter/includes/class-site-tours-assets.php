<?php
/**
 * Enqueues the shared bundles and wires them up:
 *  - front (everyone): the player + localized published tours; a shortcode
 *    renders trigger buttons.
 *  - admin (users who can edit): the builder, mounted on ?tours-edit=1 with a
 *    WordPress-backed store (REST + nonce).
 *
 * Both scripts load in the footer with `defer` (via a filter, so it works on
 * every supported WordPress version) — nothing blocks page rendering.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Site_Tours_Assets {

	const FRONT_HANDLE = 'site-tours-front';
	const ADMIN_HANDLE = 'site-tours-admin';

	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_filter( 'script_loader_tag', array( __CLASS__, 'defer' ), 10, 2 );
		add_shortcode( 'site_tour', array( __CLASS__, 'shortcode' ) );
	}

	public static function enqueue() {
		// Player for every visitor, with the published tours inlined.
		wp_enqueue_script(
			self::FRONT_HANDLE,
			SITE_TOURS_URL . 'assets/tours-front.js',
			array(),
			SITE_TOURS_VERSION,
			true
		);
		wp_localize_script(
			self::FRONT_HANDLE,
			'SiteToursFront_data',
			array(
				'drafts'        => self::visible_drafts(),
				'authenticated' => is_user_logged_in(),
				'role'          => self::current_role(),
				/**
				 * Extra facts a tour rule may target — membership level, plan,
				 * enrollment. Empty by default: WordPress core has no such
				 * concept, and every membership plugin models it differently,
				 * so this is a filter rather than a guess.
				 */
				'traits'        => (object) apply_filters( 'site_tours_viewer_traits', array() ),
				/** Keys the builder can offer, so an author picks instead of typing. */
				'traitKeys'     => Site_Tours_Viewer::known_keys(),
			)
		);

		// Builder for editors, on their own site (authoring level 0).
		if ( current_user_can( 'edit_posts' ) ) {
			wp_enqueue_script(
				self::ADMIN_HANDLE,
				SITE_TOURS_URL . 'assets/tours-admin.js',
				array(),
				SITE_TOURS_VERSION,
				true
			);
			wp_add_inline_script( self::ADMIN_HANDLE, self::admin_boot(), 'after' );
		}
	}

	/** Published tours visible to the current visitor (audience filtered). */
	/**
	 * The current user's primary role, or null for a guest.
	 *
	 * WordPress allows several roles per user; tour rules compare a single
	 * value, so the first is used — matching how role is displayed in wp-admin.
	 */
	private static function current_role() {
		$user = wp_get_current_user();
		if ( ! $user || ! $user->ID || empty( $user->roles ) ) {
			return null;
		}
		return (string) reset( $user->roles );
	}

	private static function visible_drafts() {
		$authed = is_user_logged_in();
		return array_values(
			array_filter(
				Site_Tours_CPT::get_published_drafts(),
				static function ( $d ) use ( $authed ) {
					$audience = isset( $d['audience'] ) ? $d['audience'] : 'all';
					if ( 'auth' === $audience ) {
						return $authed;
					}
					if ( 'guest' === $audience ) {
						return ! $authed;
					}
					return true;
				}
			)
		);
	}

	/** Mount the builder from the URL flag, backed by the REST store. */
	private static function admin_boot() {
		$url   = esc_url_raw( rest_url( Site_Tours_REST::NAMESPACE . Site_Tours_REST::ROUTE ) );
		$nonce = wp_create_nonce( 'wp_rest' );
		$cfg   = wp_json_encode(
			array(
				'url'   => $url,
				'nonce' => $nonce,
			)
		);
		// Keys this site can actually answer for. Without them an author types
		// trait names blind, and a typo matches nobody without saying so.
		$keys = wp_json_encode( Site_Tours_Viewer::known_keys() );
		return 'window.addEventListener("load",function(){'
			. 'var S=window.SiteToursAdmin;if(!S)return;'
			. 'var b=document.getElementById("wpadminbar");'
			. 'var off=b?b.offsetHeight:0;'
			. 'S.TourBuilder.fromUrl({topOffset:off,traitKeys:' . $keys . ','
			. 'storage:S.createWordPressStore(' . $cfg . ')});'
			. '});';
	}

	/** Add defer to our handles — compatible with all WordPress versions. */
	public static function defer( $tag, $handle ) {
		if ( self::FRONT_HANDLE === $handle || self::ADMIN_HANDLE === $handle ) {
			if ( false === strpos( $tag, ' defer' ) ) {
				$tag = str_replace( ' src=', ' defer src=', $tag );
			}
		}
		return $tag;
	}

	/** [site_tour id="tour-…" label="Start tour"] → a trigger button. */
	public static function shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'id'    => '',
				'label' => __( 'Start tour', 'site-tours' ),
			),
			$atts,
			'site_tour'
		);
		return sprintf(
			'<button type="button" class="site-tours-trigger" data-site-tour="%1$s">%2$s</button>',
			esc_attr( $atts['id'] ),
			esc_html( $atts['label'] )
		);
	}
}
