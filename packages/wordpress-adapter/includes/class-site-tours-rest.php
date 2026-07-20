<?php
/**
 * REST controller — the wire format of the editor's TourStore. GET returns all
 * drafts, POST replaces them. Both require the edit_posts capability; WordPress
 * verifies the X-WP-Nonce the editor sends for cookie-authenticated requests.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Site_Tours_REST {

	const NAMESPACE = 'site-tours/v1';
	const ROUTE     = '/drafts';

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	public static function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			self::ROUTE,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'get_drafts' ),
					'permission_callback' => array( __CLASS__, 'can_edit' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'save_drafts' ),
					'permission_callback' => array( __CLASS__, 'can_edit' ),
				),
			)
		);
	}

	public static function can_edit() {
		return current_user_can( 'edit_posts' );
	}

	public static function get_drafts() {
		return rest_ensure_response( Site_Tours_CPT::get_drafts() );
	}

	public static function save_drafts( WP_REST_Request $request ) {
		$body = $request->get_json_params();
		if ( ! is_array( $body ) ) {
			return new WP_Error(
				'site_tours_invalid',
				__( 'Expected an array of tours.', 'site-tours' ),
				array( 'status' => 400 )
			);
		}
		Site_Tours_CPT::save_drafts( $body );
		return rest_ensure_response(
			array(
				'ok'    => true,
				'count' => count( $body ),
			)
		);
	}
}
