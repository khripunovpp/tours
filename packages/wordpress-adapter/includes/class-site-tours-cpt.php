<?php
/**
 * Storage: tours live in a private custom post type. The full draft (steps,
 * display, kind, status) is kept as JSON in post_content — one source of truth
 * — with the id and kind mirrored into post meta for reconciliation. This is
 * the TourStore the editor talks to, mapped onto native WordPress posts so the
 * data survives updates and shows up in the admin.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Site_Tours_CPT {

	const POST_TYPE = 'site_tour';
	const META_ID   = '_site_tours_id';
	const META_KIND = '_site_tours_kind';

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	public static function register() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'          => array(
					'name'          => __( 'Tours', 'site-tours' ),
					'singular_name' => __( 'Tour', 'site-tours' ),
				),
				'public'          => false,
				'show_ui'         => true,
				'show_in_menu'    => true,
				'menu_icon'       => 'dashicons-location-alt',
				'menu_position'   => 26,
				'supports'        => array( 'title' ),
				'capability_type' => 'post',
				'map_meta_cap'    => true,
				'show_in_rest'    => false,
			)
		);
	}

	/** All tours (any status) as decoded draft arrays — for the editor. */
	public static function get_drafts() {
		$posts = get_posts(
			array(
				'post_type'        => self::POST_TYPE,
				'post_status'      => array( 'publish', 'draft', 'pending', 'private' ),
				'numberposts'      => -1,
				'suppress_filters' => false,
			)
		);
		$out = array();
		foreach ( $posts as $post ) {
			$data = json_decode( $post->post_content, true );
			if ( is_array( $data ) ) {
				$out[] = $data;
			}
		}
		return $out;
	}

	/** Only published tours (not templates) — for the front-end player. */
	public static function get_published_drafts() {
		return array_values(
			array_filter(
				self::get_drafts(),
				static function ( $d ) {
					$kind = isset( $d['kind'] ) ? $d['kind'] : 'tour';
					return isset( $d['status'] ) && 'published' === $d['status'] && 'tour' === $kind;
				}
			)
		);
	}

	/** Replace-all: upsert each draft by its id, delete the ones removed. */
	public static function save_drafts( $drafts ) {
		if ( ! is_array( $drafts ) ) {
			return;
		}

		$incoming = array();
		foreach ( $drafts as $draft ) {
			if ( ! is_array( $draft ) || empty( $draft['id'] ) ) {
				continue;
			}
			$id         = (string) $draft['id'];
			$incoming[] = $id;
			$kind       = ( isset( $draft['kind'] ) && 'template' === $draft['kind'] ) ? 'template' : 'tour';
			$status     = ( isset( $draft['status'] ) && 'published' === $draft['status'] ) ? 'publish' : 'draft';
			$name       = isset( $draft['name'] ) ? sanitize_text_field( $draft['name'] ) : __( 'Untitled tour', 'site-tours' );

			$postarr = array(
				'post_type'    => self::POST_TYPE,
				'post_title'   => $name,
				'post_status'  => $status,
				'post_content' => wp_slash( wp_json_encode( $draft ) ),
			);

			$existing = self::find_by_id( $id );
			if ( $existing ) {
				$postarr['ID'] = $existing;
				$post_id       = wp_update_post( $postarr, true );
			} else {
				$post_id = wp_insert_post( $postarr, true );
			}

			if ( $post_id && ! is_wp_error( $post_id ) ) {
				update_post_meta( $post_id, self::META_ID, $id );
				update_post_meta( $post_id, self::META_KIND, $kind );
			}
		}

		self::delete_missing( $incoming );
	}

	/** Delete tour posts whose id is no longer present in the payload. */
	private static function delete_missing( array $incoming ) {
		$ids = get_posts(
			array(
				'post_type'   => self::POST_TYPE,
				'post_status' => 'any',
				'numberposts' => -1,
				'fields'      => 'ids',
			)
		);
		foreach ( $ids as $post_id ) {
			$mid = (string) get_post_meta( $post_id, self::META_ID, true );
			if ( '' !== $mid && ! in_array( $mid, $incoming, true ) ) {
				wp_delete_post( $post_id, true );
			}
		}
	}

	private static function find_by_id( $id ) {
		$ids = get_posts(
			array(
				'post_type'   => self::POST_TYPE,
				'post_status' => 'any',
				'numberposts' => 1,
				'fields'      => 'ids',
				'meta_key'    => self::META_ID,   // phpcs:ignore WordPress.DB.SlowDBQuery
				'meta_value'  => $id,             // phpcs:ignore WordPress.DB.SlowDBQuery
			)
		);
		return $ids ? (int) $ids[0] : 0;
	}
}
